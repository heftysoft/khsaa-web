import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const paymentInfo = await db.paymentInfo.findFirst();
    return NextResponse.json(paymentInfo);
  } catch (error) {
    console.error('[PAYMENT_INFO_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { bankInfo, bkashInfo, nagadInfo, rocketInfo } = body;

    // Validate that all fields are strings
    if (typeof bankInfo !== 'string' || 
        typeof bkashInfo !== 'string' || 
        typeof nagadInfo !== 'string' || 
        typeof rocketInfo !== 'string') {
      return new NextResponse('Invalid input: all fields must be text', { status: 400 });
    }

    const paymentInfo = await db.paymentInfo.upsert({
      where: {
        id: '1', // Single record
      },
      update: {
        bankInfo,
        bkashInfo,
        nagadInfo,
        rocketInfo,
      },
      create: {
        id: '1',
        bankInfo,
        bkashInfo,
        nagadInfo,
        rocketInfo,
      },
    });

    return NextResponse.json(paymentInfo);
  } catch (error) {
    console.error('[PAYMENT_INFO_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}