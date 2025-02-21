import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const notification = await db.notification.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return new NextResponse('Notification not found', { status: 404 });
    }

    const updatedNotification = await db.notification.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('[NOTIFICATION_READ]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}