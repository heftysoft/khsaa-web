import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { MembershipType } from '@prisma/client';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { attendees: true } },
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    // Check capacity
    if (event.capacity && event._count.attendees >= event.capacity) {
      return new NextResponse('Event is full', { status: 400 });
    }

    // Check membership requirement
    if (event.membershipRequired) {
      const membership = await db.membership.findFirst({
        where: {
          userId: session.user.id,
          status: 'ACTIVE',
          tier: {
            type: {
              in: [event.membershipRequired as MembershipType, 'LIFETIME'],
            },
          },
        },
      });

      if (!membership) {
        return new NextResponse('Membership required', { status: 403 });
      }
    }

    // Handle paid events
    if (event.isPaid) {
      const body = await req.json();
      const { paymentMethod, transactionId, paymentProof } = body;

      if (!paymentMethod || !transactionId || !paymentProof) {
        return new NextResponse('Payment information required', { status: 400 });
      }

      if (!session.user?.id) {
        return new NextResponse('User not found', { status: 401 });
      }

      // Create payment record
      const payment = await db.eventPayment.create({
        data: {
          event: {
            connect: {
              id: eventId
            }
          },
          user: {
            connect: {
              id: session.user.id
            }
          },
          amount: event.price || 0,
          paymentMethod: paymentMethod,
          transactionId: transactionId,
          proof: paymentProof,
          status: 'PENDING',
        },
      });

      // Create notification for admin
      await db.notification.create({
        data: {
          title: 'New Event Payment',
          message: `New payment submitted for event: ${event.title}`,
          type: 'EVENT',
          user: {
            connect: {
              id: session.user.id
            }
          }
        },
      });

      return NextResponse.json({ status: 'PENDING', paymentId: payment.id });
    }

    // For free events, directly add attendee
    await db.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json({ status: 'APPROVED' });
  } catch (error) {
    console.error('[EVENT_JOIN]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        attendees: {
          disconnect: {
            id: session.user.id,
          },
        },
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[EVENT_LEAVE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}