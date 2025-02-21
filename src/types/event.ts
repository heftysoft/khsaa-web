export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number | null;
  image: string;
  membershipRequired: string | null;
  isPaid: boolean;
  price: number | null;
  organizer: {
    name: string;
  };
  attendees: {
    id: string;
    name: string;
    image: string;
  }[];
  _count: {
    attendees: number;
  };
  payments?: {
    id: string;
    status: string;
    userId: string;
    createdAt: string;
  }[];
}
