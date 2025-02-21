import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'VERIFIED',
      },
    });

    // Create notification for user
    await db.notification.create({
      data: {
        title: 'Account Verified',
        message: 'Your account has been verified. You now have full access to all features.',
        type: 'SYSTEM',
        user: {
          connect: {
            id: userId
          }
        }
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_VERIFY]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}