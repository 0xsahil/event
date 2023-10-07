import { ID } from "appwrite";
import { storage } from "@/lib/appwrite";



const bucketId = import.meta.env.VITE_APPWRITE_EVENTS_BUCKET_ID;

export async function uploadFile(file:File) {
    const data = await storage.createFile(bucketId, ID.unique(), file);
    return data;
}
export async function deleteFileById(fileId: string) {
    const data = await storage.deleteFile(bucketId, fileId);
    return data;
}

export function getPreviewByImageId(fileId : string) {
    return storage.getFilePreview(bucketId, fileId);
}