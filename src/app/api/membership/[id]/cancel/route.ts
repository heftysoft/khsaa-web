import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { MembershipStatus } from "@prisma/client";
import { updateProfileMembershipType } from "@/lib/utils";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const membership = await db.membership.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        status: "CANCELLED" as MembershipStatus,
      },
      include: {
        tier: true,
      },
    });

    // Update user status to PAYMENT_PENDING
    await db.user.update({
      where: { id: session.user.id },
      data: {
        status: 'PAYMENT_PENDING',
      },
    });

    await db.notification.create({
      data: {
        title: "Membership Cancelled",
        message: "Your membership has been cancelled.",
        type: "MEMBERSHIP",
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    // Reset profile to GENERAL membership type
    await updateProfileMembershipType(session.user.id, "GENERAL");

    return NextResponse.json(membership);
  } catch (error) {
    console.error("[MEMBERSHIP_CANCEL]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
