import {credential} from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore({
  projectId: 'yt-clone-a3001', // Your Google Cloud project ID
  databaseId: 'f101f09f-485b-41de-8373-3da56dc366e7' // Your Firestore database ID
});

// Note: This requires setting an env variable in Cloud Run
/** if (process.env.NODE_ENV !== 'production') {
  firestore.settings({
      host: "localhost:8080", // Default port for Firestore emulator
      ssl: false
  });
} */

const videoCollectionId = 'videos';

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

async function getVideo(videoId: string) {
  const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
  return (snapshot.data() as Video) ?? {};
}

export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, {merge: true});
}

export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}
