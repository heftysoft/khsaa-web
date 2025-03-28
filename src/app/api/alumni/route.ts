import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await db.user.count({
      where: {
        status: 'VERIFIED',
        profile: {
          membershipStatus: 'ACTIVE'
        }
      },
    });

    // Get paginated alumni
    const alumni = await db.user.findMany({
      where: {
        status: 'VERIFIED',
        profile: {
          membershipStatus: 'ACTIVE'
        }
      },
      include: {
        profile: {
          select: {
            occupation: true,
            designation: true,
            employerName: true,
            passingYear: true,
            photo: true,
            socialLinks: true,
            presentAddress: true,
            mobileNumber: true,
            membershipType: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      alumni,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('[ALUMNI_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}