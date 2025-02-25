import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { reason } = await req.json();

    if (!reason) {
      return new NextResponse('Rejection reason is required', { status: 400 });
    }

    const { userId } = await params;

    // Update user status to REJECTED
    const user = await db.user.update({
      where: { id: userId },
      data: {
        status: 'REJECTED',
        profile: {
          update: {
            membershipStatus: 'CANCELLED',
          }
        }
      },
      include: {
        profile: true,
      }
    });

    // Create rejection notification
    await db.notification.create({
      data: {
        userId: userId,
        title: 'Profile Rejected',
        message: `Your profile has been rejected. Reason: ${reason}`,
        type: 'SYSTEM',
      },
    });

    // Cancel any pending memberships
    await db.membership.updateMany({
      where: {
        userId: userId,
        status: 'PENDING',
      },
      data: {
        status: 'CANCELLED',
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_REJECT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
