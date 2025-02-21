import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadFile } from '@/lib/sftp';
import { PageConfig } from 'next';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new NextResponse('Invalid file type', { status: 400 });
    }

    // Convert File to Buffer
    console.log(file);
    const fileArray = await file.arrayBuffer();
    const buffer = Buffer.from(fileArray);

    // Upload using SFTP
    const url = await uploadFile(buffer, file.name);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export const config: PageConfig = {
  api: {
      bodyParser: false,
  },
};