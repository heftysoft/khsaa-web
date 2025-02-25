import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

interface ProfileData {
  fatherName: string;
  motherName: string;
  presentAddress: string;
  permanentAddress: string;
  mobileNumber: string;
  birthday: Date | null;
  nationality: string;
  religion: string;
  sscRegNumber: string;
  sscRollNumber: string;
  passingYear: number | null;
  occupation: string;
  employerName: string;
  designation: string;
  employerAddress: string;
  reference: string;
  signature?: string;
  photo?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    
    // Parse social links from JSON string
    let socialLinks = {};
    const socialLinksData = formData.get('socialLinks');
    if (socialLinksData) {
      try {
        socialLinks = JSON.parse(socialLinksData as string);
      } catch (e) {
        console.error('Error parsing social links:', e);
      }
    }
    
    // Create profile data object
    const profileData: ProfileData = {
      fatherName: formData.get('fatherName') as string,
      motherName: formData.get('motherName') as string,
      presentAddress: formData.get('presentAddress') as string,
      permanentAddress: formData.get('permanentAddress') as string,
      mobileNumber: formData.get('mobileNumber') as string,
      birthday: formData.get('birthday') ? new Date(formData.get('birthday') as string) : null,
      nationality: formData.get('nationality') as string,
      religion: formData.get('religion') as string,
      sscRegNumber: formData.get('sscRegNumber') as string,
      sscRollNumber: formData.get('sscRollNumber') as string,
      passingYear: formData.get('passingYear') ? parseInt(formData.get('passingYear') as string) : null,
      occupation: formData.get('occupation') as string,
      employerName: formData.get('employerName') as string,
      designation: formData.get('designation') as string,
      employerAddress: formData.get('employerAddress') as string,
      reference: formData.get('reference') as string,
      signature: formData.get('signature') as string,
      photo: formData.get('photo') as string,
      socialLinks: socialLinks,
    };

    // Check if user has any membership
    const existingMembership = await db.membership.findFirst({
      where: { 
        userId: session.user.id,
        status: 'ACTIVE',
      },
    });

    // Get the membership tier to determine the type
    const tier = existingMembership?.tierId ? await db.membershipTier.findUnique({
      where: { id: existingMembership?.tierId },
    }): null;

    // Update user profile with appropriate status
    await db.user.update({
      where: { id: session.user.id },
      data: {
        status: existingMembership ? 'INPROGRESS' : 'PAYMENT_PENDING' as const,
        profile: {
          upsert: {
            create: {
              ...profileData,
              membershipStatus: existingMembership ? 'ACTIVE' : 'PENDING' as const,
              membershipType: existingMembership?.tierId ? tier?.type ? tier.type : 'GENERAL' : 'GENERAL' as const,
            },
            update: {
              ...profileData,
              membershipStatus: existingMembership ? 'ACTIVE' : 'PENDING' as const,
              membershipType: existingMembership?.tierId ? tier?.type : 'GENERAL' as const,
            },
          },
        },
      },
    });

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: existingMembership ? 'Profile Updated' : 'Payment Required',
        message: existingMembership 
          ? 'Your profile has been updated and is pending review.'
          : 'Please complete your membership payment to proceed.',
        type: 'SYSTEM',
      },
    });

    return NextResponse.json({ 
      success: true,
      requiresPayment: !existingMembership 
    });
  } catch (error) {
    console.error('[PROFILE_UPDATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    return NextResponse.json(user?.profile || null);
  } catch (error) {
    console.error('[PROFILE_GET]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}