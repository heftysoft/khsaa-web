import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { MembershipStatus } from "@prisma/client";
import { updateProfileMembershipType } from "@/lib/utils";

const createMembershipSchema = z.object({
  tierId: z.string(),
  paymentMethod: z.enum(["BANK", "BKASH", "NAGAD", "ROCKET"]),
  transactionId: z.string(),
  paymentDetails: z.string(),
  paymentProof: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const membership = await db.membership.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        tier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error("[MEMBERSHIP_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const result = createMembershipSchema.safeParse(body);

    if (!result.success) {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const {
      tierId,
      paymentMethod,
      transactionId,
      paymentDetails,
      paymentProof,
    } = result.data;

    // Get the membership tier to determine the type
    const tier = await db.membershipTier.findUnique({
      where: { id: tierId },
    });

    if (!tier) {
      return new NextResponse("Membership tier not found", { status: 404 });
    }

    const membership = await db.membership.create({
      data: {
        userId: session.user.id,
        tierId,
        amount: tier.amount,
        status: MembershipStatus.PENDING,
        paymentMethod,
        transactionId,
        paymentDetails,
        paymentProof,
      },
      include: {
        tier: true,
      },
    });

    await db.notification.create({
      data: {
        title: "Membership Application Submitted",
        message: "Your membership application is under review.",
        type: "MEMBERSHIP",
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    // Update profile membershipType
    await updateProfileMembershipType(session.user.id, tier.type);

    return NextResponse.json(membership);
  } catch (error) {
    console.error("[MEMBERSHIP_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
