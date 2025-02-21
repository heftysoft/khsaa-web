import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string; paymentId: string }> }
) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { paymentId, eventId } = await params;

    // Update payment status
    const payment = await db.eventPayment.update({
      where: { id: paymentId },
      data: { status: 'REJECTED' },
      include: { user: true },
    });

    // Remove user from event attendees
    await db.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          disconnect: {
            id: payment.userId,
          },
        },
      },
    });

    // Notify user
    await db.notification.create({
      data: {
        title: 'Payment Rejected',
        message: 'Your event payment has been rejected. Please contact support for more information.',
        type: 'EVENT',
        user: {
          connect: {
            id: payment.userId
          }
        }
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PAYMENT_REJECT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}