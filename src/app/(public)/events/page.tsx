'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, CalendarX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number | null;
  image: string;
  membershipRequired: string | null;
  organizer: {
    name: string;
  };
  _count: {
    attendees: number;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/events?filter=${filter}`);
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="container-wrapper">
      <div className="container py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">Events</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming Events</SelectItem>
              <SelectItem value="past">Past Events</SelectItem>
              <SelectItem value="all">All Events</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarX2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Events Found</h2>
            <p className="text-muted-foreground max-w-sm">
              {filter === 'upcoming' 
                ? "There are no upcoming events scheduled at the moment." 
                : filter === 'past' 
                  ? "No past events are available."
                  : "No events are available at this time."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(event.date), 'PPP')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  {event.capacity && (
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <Users className="h-4 w-4" />
                      {event._count.attendees}/{event.capacity} attendees
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  {event.membershipRequired && (
                    <Badge variant="secondary" className="mt-2">
                      {event.membershipRequired} Members Only
                    </Badge>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}