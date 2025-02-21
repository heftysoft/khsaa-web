import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { NotificationType } from '@prisma/client';
import { z } from 'zod';

const notificationSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.nativeEnum(NotificationType)
});

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to most recent 10 notifications
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const result = notificationSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse('Invalid request body', { status: 400 });
    }

    const { title, message, type } = result.data;

    const notification = await db.notification.create({
      data: {
        title,
        message,
        type,
        user: {
          connect: {
            id: session.user.id
          }
        }
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('[NOTIFICATIONS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}