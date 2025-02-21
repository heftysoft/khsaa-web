import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit');
    const albumId = searchParams.get('albumId');
    
    const gallery = await db.gallery.findMany({
      where: {
        ...(albumId ? { albumId } : {}),
      },
      orderBy: {
        order: 'asc',
      },
      ...(limit ? { take: parseInt(limit) } : {}),
      include: {
        album: true,
      },
    });
    
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('[GALLERY_GET]', error);
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
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const image = formData.get('image') as string;
    const order = parseInt(formData.get('order') as string);
    const albumId = formData.get('albumId') as string;

    const gallery = await db.gallery.create({
      data: {
        title,
        category,
        image,
        order,
        albumId: albumId || null,
      },
      include: {
        album: true,
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('[GALLERY_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}