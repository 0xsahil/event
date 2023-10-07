import { useEffect, useState } from "react";
import { useLocation } from 'wouter';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Button from '@/components/Button';

// import events from '@/data/events.json';

import { EventTypes } from "@/types/events";

import { deleteEventById, fetchEventById } from '@/lib/events';
import { getPreviewByImageId } from "@/lib/storage";
import { useAuth } from "@/hooks/user-auth";

function Event({ params }: { params: { eventId: string } }) {
  
  const [, navigate] = useLocation();
  const [event, setEvent] = useState<EventTypes | undefined>();
  const { isAdmin } = useAuth();
  const imageUrl = event?.imageFileId && getPreviewByImageId(event?.imageFileId);
  const image = {
    url: imageUrl as string ,
    alt: 'Event Description',
    height: event?.imageHeight,
    width: event?.imageWidth,
  };


  useEffect(() => {
    (async function run() {
      const { event } = await fetchEventById(params.eventId);
      setEvent(event);
    })();
  }, [params.eventId])

  async function handleOnDeleteEvent() {
    if (!event?.$id) return;
    await deleteEventById(event.$id);
    navigate('/');
  }


  return (
    <Layout>
      <Container className="grid gap-12 grid-cols-1 md:grid-cols-2">
        <div>
          {image?.url && (
            <img
              className="block rounded"
              width={image.width}
              height={image.height}
              src={image.url}
              alt={image.alt}
            />
          )}
        </div>

        <div>
          {event && (
            <>
              <h1 className="text-3xl font-bold mb-6">
                {event?.name}
              </h1>
              <p className="text-lg font-medium text-neutral-600 dark:text-neutral-200">
                <strong>Date:</strong> {event?.date && new Date(event?.date).toLocaleString('en-US', { month: 'long', day: 'numeric' })}
              </p>
              <p className="text-lg font-medium text-neutral-600 dark:text-neutral-200">
                <strong>Location:</strong> {event?.location}
              </p>
              {isAdmin && (
                <p className="mt-6">
                  <Button onClick={handleOnDeleteEvent} color="red">Delete Event</Button>
                </p>
              )}
            </>
          )}
        </div>
      </Container>
    </Layout>
  )
}

export default Event;
