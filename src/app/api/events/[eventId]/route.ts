import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  try {
    const session = await auth();
    
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        organizer: {
          select: {
            name: true,
          },
        },
        attendees: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
        payments: session?.user ? {
          where: {
            userId: session.user.id,
          },
          select: {
            id: true,
            status: true,
            userId: true,
            createdAt: true,
          },
        } : false,
      },
    });

    if (!event) {
      return new NextResponse('Event not found', { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('[EVENT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const location = formData.get('location') as string;
    const capacity = formData.get('capacity') ? parseInt(formData.get('capacity') as string) : null;
    const image = formData.get('image') as string;
    const membershipRequired = formData.get('membershipRequired') as string;

    if (!title || !description || !date || !location || !image) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const event = await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity,
        image,
        membershipRequired: membershipRequired === 'NONE' ? null : membershipRequired,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('[EVENT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[EVENT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
