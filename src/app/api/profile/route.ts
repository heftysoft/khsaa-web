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
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    
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
    };

    // Update user profile
    await db.user.update({
      where: { id: session.user.id },
      data: {
        status: 'INPROGRESS',
        profile: {
          upsert: {
            create: profileData,
            update: profileData,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
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