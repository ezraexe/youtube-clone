import {credential} from "firebase-admin";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";

// Initialize with explicit project ID and credentials
initializeApp({
  credential: credential.applicationDefault(),
  projectId: 'yt-clone-a3001',
  databaseURL: 'https://yt-clone-a3001.firebaseio.com'
});

// Initialize Firestore with specific settings
const firestore = new Firestore({
  projectId: 'yt-clone-a3001',
  databaseId: 'yt-firestore'  // Your database ID
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
  try {
    const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
    return (snapshot.data() as Video) ?? {};
  } catch (error) {
    console.error('Error getting video:', error);
    return {};
  }
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
