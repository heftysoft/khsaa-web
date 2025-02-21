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

    const { eventId, paymentId } = await params;

    // Update payment status
    const payment = await db.eventPayment.update({
      where: { id: paymentId },
      data: { status: 'APPROVED' },
      include: { user: true },
    });

    // Add user to event attendees
    await db.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          connect: {
            id: payment.userId,
          },
        },
      },
    });

    // Notify user
    await db.notification.create({
      data: {
        title: 'Payment Approved',
        message: 'Your event payment has been approved. You are now registered for the event.',
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
    console.error('[PAYMENT_APPROVE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}