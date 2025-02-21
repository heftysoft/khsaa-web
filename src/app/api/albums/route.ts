import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const albums = await db.album.findMany({
      include: {
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(albums);
  } catch (error) {
    console.error('[ALBUMS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, description } = await req.json();

    const album = await db.album.create({
      data: {
        title,
        description,
      },
      include: {
        photos: true,
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error('[ALBUMS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}