
import EventDetails from '@/components/events/event-details';
import EventDetailsSkeleton from '@/components/events/event-details-skeleton';
import EventHeroSkeleton from '@/components/events/event-hero-skeleton';
import { Suspense} from 'react';

// Main component
export default async function EventDetailsPage({ params }: { params: Promise<{ eventId: string }> }) {

  const { eventId } = await params;

  return (
    <Suspense fallback={
      <>
        <EventHeroSkeleton />
        <EventDetailsSkeleton />
      </>
    }>
      <EventDetails eventId={eventId} />
    </Suspense>
  );
}