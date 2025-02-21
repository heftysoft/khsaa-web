import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  // Public route, no auth needed
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter');
    const userId = searchParams.get('userId');

    let where = {};

    if (filter === 'upcoming') {
      where = {
        date: {
          gte: new Date(),
        },
      };
    } else if (filter === 'past') {
      where = {
        date: {
          lt: new Date(),
        },
      };
    }

    if (userId) {
      where = {
        ...where,
        attendees: {
          some: {
            id: userId,
          },
        },
      };
    }

    const events = await db.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            name: true,
          },
        },
        attendees: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            attendees: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('[EVENTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
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
    const isPaid = formData.get('isPaid') === 'true';
    const price = formData.get('price') ? parseFloat(formData.get('price') as string) : null;

    if (!title || !description || !date || !location || !image) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const data = {
      title,
      description,
      date: new Date(date),
      location,
      capacity,
      image,
      isPaid,
      price: isPaid ? price : null,
      membershipRequired: membershipRequired === 'NONE' ? null : membershipRequired,
      organizer: {
        connect: {
          id: session.user.id
        }
      }
    };

    const event = await db.event.create({
      data,
      include: {
        organizer: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('[EVENTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}