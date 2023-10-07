import { Models, ID } from "appwrite";
import { EventTypes } from "@/types/events";
import { db } from "./appwrite";
import { deleteFileById } from "./storage";

const dbId = import.meta.env.VITE_APPWRITE_EVENTS_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_EVENTS_DATABASE_COLLECTION_ID;

export async function fetchEvents() {
    const { documents } = await db.listDocuments(dbId, collectionId);
    return {
        events: documents.map(mapDocumentToEvent)
    }
}


export async function fetchEventById(eventId: EventTypes['$id']) {
    const document = await db.getDocument(dbId, collectionId, eventId);
    return {
        event: mapDocumentToEvent(document)
    }
}

export async function deleteEventById(eventId: EventTypes['$id']) {
    const { event } = await fetchEventById(eventId);
    if (event.imageFileId) {
        await deleteFileById(event.imageFileId);
    }
    await db.deleteDocument(dbId, collectionId, eventId);
}

export async function createEvent(event: Omit<EventTypes, '$id'>) {
    const document = await db.createDocument(import.meta.env.VITE_APPWRITE_EVENTS_DATABASE_ID, import.meta.env.VITE_APPWRITE_EVENTS_DATABASE_COLLECTION_ID, ID.unique(), event);
    return {
        event: mapDocumentToEvent(document)
    }
}

const mapDocumentToEvent = (doc: Models.Document) => {
    const event: EventTypes = {
        $id: doc.$id,
        name: doc.name,
        location: doc.location,
        date: doc.date,
        imageWidth: doc?.imageWidth,
        imageHeight: doc?.imageHeight,
        imageFileId: doc?.imageFileId,
    }
    return event;
}