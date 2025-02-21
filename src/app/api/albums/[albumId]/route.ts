import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  const { albumId } = await params;
  try {
    const album = await db.album.findUnique({
      where: {
        id: albumId,
      },
      include: {
        photos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!album) {
      return new NextResponse('Album not found', { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error('[ALBUM_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  const { albumId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { title, description } = await req.json();

    const album = await db.album.update({
      where: {
        id: albumId,
      },
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
    console.error('[ALBUM_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  const { albumId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.album.delete({
      where: {
        id: albumId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[ALBUM_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}