import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const order = parseInt(formData.get('order') as string);
    const albumId = formData.get('albumId') as string;

    const gallery = await db.gallery.update({
      where: { id },
      data: {
        title,
        category,
        order,
        albumId: albumId || null,
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('[GALLERY_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.gallery.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[GALLERY_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}