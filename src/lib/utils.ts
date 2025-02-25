import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { db } from "./db";
import { MembershipType } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function updateProfileMembershipType(userId: string, membershipType: MembershipType) {
  await db.profile.update({
    where: { userId },
    data: { membershipType },
  });
}