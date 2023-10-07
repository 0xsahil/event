import { useEffect, useState } from "react";
import { Link } from 'wouter';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import EventCard from '@/components/EventCard';

// import events from '@/data/events.json';
import { fetchEvents } from "@/lib/events";
import { EventTypes } from "@/types/events";
import { getPreviewByImageId } from "@/lib/storage";
import { useAuth } from "@/hooks/user-auth";

function Home() {
  const { session } = useAuth();
  const [events, setEvents] = useState<Array<EventTypes> | undefined>();
  useEffect(() => {
    (async function run() {
      const { events } = await fetchEvents();
      setEvents(events);
      // console.log(events);
    })()

  }, []);

  return (
    <Layout>
      {Array.isArray(events) && events.length > 0 && (
        <>
          <Container className="flex justify-between items-center mb-10">
            <h1 className="text-lg font-bold uppercase text-slate-600 dark:text-slate-200">
              Upcoming Events
            </h1>
            {session && (
              <p>
                <Link href="/events/new">
                  <a className="inline-block rounded bg-slate-600 py-1.5 px-4 text-xs font-bold uppercase text-white hover:bg-slate-500 hover:text-white">
                    Add Event
                  </a>
                </Link>
              </p>
            )}
          </Container>

          <Container>
            <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                return (
                  <Link key={event.$id} href={`/event/${event.$id}`}>
                    <a>
                      <EventCard
                        date={event.date}
                        image={{
                          alt: '',
                          height: event?.imageHeight as number,
                          url: (event?.imageFileId && getPreviewByImageId(event?.imageFileId)) as string,
                          width: event?.imageWidth as number
                        }}
                        location={event.location}
                        name={event.name}
                      />
                    </a>
                  </Link>
                )
              })}
            </div>
          </Container>
        </>
      )}
      {Array.isArray(events) && events.length === 0 && (
        <Container>
          <p className="w-100 text-center mb-5">
            No events currently scheduled.
          </p>
          {session && (
            <p className="w-100 text-center">
              <Link href="/events/new">
                <a>
                  Add an Event
                </a>
              </Link>
            </p>
          )}
        </Container>
      )}
    </Layout>
  )
}

export default Home;
