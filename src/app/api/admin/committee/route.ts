import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const committee = await db.committee.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    
    return NextResponse.json(committee);
  } catch (error) {
    console.error('[COMMITTEE_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const designation = formData.get('designation') as string;
    const image = formData.get('image') as string;
    const order = parseInt(formData.get('order') as string);

    const committee = await db.committee.create({
      data: {
        name,
        designation,
        image,
        order,
      },
    });

    return NextResponse.json(committee);
  } catch (error) {
    console.error('[COMMITTEE_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}