/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth } from './auth';

export async function withAuth(handler: any) {
  return async (req: Request, ...args: any[]) => {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return handler(req, ...args);
  };
}

export async function withAdminAuth(handler: any) {
  return async (req: Request, ...args: any[]) => {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return handler(req, ...args);
  };
}

export async function withVerifiedAuth(handler: any) {
  return async (req: Request, ...args: any[]) => {
    const session = await auth();
    if (!session?.user?.id || session.user.status !== 'VERIFIED') {
      return new NextResponse('Account not verified', { status: 403 });
    }
    return handler(req, ...args);
  };
}