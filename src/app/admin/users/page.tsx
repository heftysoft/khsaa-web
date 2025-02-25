
import { UsersClient } from './client';
import { UserColumn } from '@/types/admin-user';
import { db } from '@/lib/db';

export default async function UsersPage() {
  const users = await db.user.findMany({
    include: {
      profile: {
        select: {
          mobileNumber: true,
          occupation: true,
          sscRegNumber: true,
          sscRollNumber: true,
          passingYear: true,
          fatherName: true,
          motherName: true,
          birthday: true,
          nationality: true,
          religion: true,
          presentAddress: true,
          permanentAddress: true,
          employerName: true,
          designation: true,
          employerAddress: true,
          reference: true,
          signature: true,
          photo: true,
          membershipType: true,
          membershipStatus: true,
        }
      },
      memberships: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        include: {
          tier: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedUsers: UserColumn[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    image: user.image,
    createdAt: user.createdAt,
    profile: user.profile ? {
      ...user.profile,
      birthday: user.profile.birthday?.toISOString() || null,
    } : null,
    membership: user.memberships[0] ? {
      type: user.memberships[0].tier.type,
      status: user.memberships[0].status,
      amount: user.memberships[0].amount,
      paymentMethod: user.memberships[0].paymentMethod,
      transactionId: user.memberships[0].transactionId,
      paymentDetails: user.memberships[0].paymentDetails,
      paymentProof: user.memberships[0].paymentProof,
      startDate: user.memberships[0].startDate,
      endDate: user.memberships[0].endDate,
    } : null,
  }));

  return <UsersClient data={formattedUsers} />;
}
