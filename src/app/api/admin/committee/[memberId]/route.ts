import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await auth();
    const { memberId } = await params;

    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, designation, image, order } = body;

    const committee = await db.committee.update({
      where: {
        id: memberId,
      },
      data: {
        name,
        designation,
        image,
        order,
      },
    });

    return NextResponse.json(committee);
  } catch (error) {
    console.error('[COMMITTEE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await auth();
    const { memberId } = await params;

    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.committee.delete({
      where: {
        id: memberId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[COMMITTEE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}