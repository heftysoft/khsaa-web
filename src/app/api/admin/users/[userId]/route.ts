import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { MembershipStatus } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Delete user and all related data (cascading delete handled by Prisma)
    await db.user.delete({
      where: { id: userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[ADMIN_USER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (!action) {
      return new NextResponse('Action is required', { status: 400 });
    }

    let membershipStatus: MembershipStatus;
    let notificationMessage: string;

    switch (action) {
      case 'CANCEL':
        membershipStatus = 'CANCELLED';
        notificationMessage = 'Your membership has been cancelled by an administrator.';
        break;
      case 'ACTIVATE':
        membershipStatus = 'ACTIVE';
        notificationMessage = 'Your membership has been activated by an administrator.';
        break;
      case 'PENDING':
        membershipStatus = 'PENDING';
        notificationMessage = 'Your membership has been set to pending by an administrator.';
        break;
      default:
        return new NextResponse('Invalid action', { status: 400 });
    }

    // Update the most recent membership
    const membership = await db.membership.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        tier: true
      }
    });

    if (membership) {
      // Calculate new dates when activating a membership
      let startDate = membership.startDate;
      let endDate = membership.endDate;
      
      if (action === 'ACTIVATE') {
        startDate = new Date(); // Set start date to now
        
        // Calculate end date based on membership period (if not lifetime)
        if (membership.tier.type !== 'LIFETIME') {
          endDate = new Date();
          switch (membership.tier.period) {
            case 'WEEKLY':
              endDate.setDate(endDate.getDate() + 7);
              break;
            case 'MONTHLY':
              endDate.setMonth(endDate.getMonth() + 1);
              break;
            case 'YEARLY':
              endDate.setFullYear(endDate.getFullYear() + 1);
              break;
          }
        } else {
          // For lifetime memberships, set endDate to null
          endDate = null;
        }
      }
      
      await db.membership.update({
        where: { id: membership.id },
        data: { 
          status: membershipStatus,
          startDate,
          endDate
        },
      });
    }

    // Update user profile membership status
    await db.user.update({
      where: { id: userId },
      data: {
        profile: {
          update: {
            membershipStatus,
          },
        },
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        title: 'Membership Status Update',
        message: notificationMessage,
        type: 'MEMBERSHIP',
        user: {
          connect: { id: userId },
        },
      },
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[ADMIN_USER_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}