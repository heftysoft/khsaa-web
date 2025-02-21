import { Role, MembershipStatus } from "@prisma/client";
import { Role, UserStatus } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email: string;
    emailVerified?: Date | null;
    password: string;
    image?: string | null;
    role: Role;
    status: UserStatus;
    rejectionReason?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: User & {
      profile?: {
        occupation?: string | null;
      };
      membershipStatus?: MembershipStatus;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
    profile?: {
      occupation?: string | null;
    };
    membershipStatus?: MembershipStatus;
  }
  interface Session {
    user: User & {
      profile?: {
        occupation?: string | null;
      };
      membershipStatus?: MembershipStatus;
    };
  }
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
    profile?: {
      occupation?: string | null;
    };
    membershipStatus?: MembershipStatus;
  }
}