export type UserColumn = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  image: string | null;
  createdAt: Date;
  profile?: {
    mobileNumber: string | null;
    occupation: string | null;
    sscRegNumber: string | null;
    sscRollNumber: string | null;
    passingYear: number | null;
    fatherName: string | null;
    motherName: string | null;
    birthday: string | null;
    nationality: string | null;
    religion: string | null;
    presentAddress: string | null;
    permanentAddress: string | null;
    employerName: string | null;
    designation: string | null;
    employerAddress: string | null;
    reference: string | null;
    signature: string | null;
  } | null;
};

// Remove or update the User interface as it's not being used
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  membershipStatus: string;
  createdAt: string;
}