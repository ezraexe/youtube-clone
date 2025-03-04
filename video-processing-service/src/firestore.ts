import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

console.log('Starting Firebase initialization...');

try {
  // Initialize Firebase Admin
  initializeApp({
    projectId: 'yt-clone-a3001'
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

// Get Firestore instance
const firestore = getFirestore();

// Configure Firestore settings
firestore.settings({
  ignoreUndefinedProperties: true
});

console.log('Firestore instance created');

const videoCollectionId = 'videos';

// Disable Firestore telemetry/tracing
process.env.FIRESTORE_DISABLE_TELEMETRY = 'true';
process.env.FIRESTORE_DISABLE_TRACING = 'true';

// Test connection immediately
(async () => {
  try {
    console.log('Testing Firestore connection...');
    await firestore.collection('test').doc('connection-test').set({
      timestamp: new Date(),
      test: true
    });
    console.log('Successfully wrote to Firestore');
  } catch (error) {
    console.error('Firestore connection test failed:', error);
  }
})();

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title?: string,
  description?: string  
}

async function getVideo(videoId: string) {
  console.log(`Getting video document with ID: ${videoId}`);
  try {
    const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
    console.log(`Document exists: ${snapshot.exists}`);
    if (!snapshot.exists) {
      console.log('Document does not exist, returning empty object');
      return {};
    }
    return snapshot.data() as Video;
  } catch (error) {
    console.error(`Error getting video ${videoId}:`, error);
    return {};  // Return empty object instead of throwing
  }
}

export function setVideo(videoId: string, video: Video) {
  console.log(`Setting video document with ID: ${videoId}`, video);
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, {merge: true})
    .then(() => {
      console.log(`Successfully set video ${videoId}`);
    })
    .catch(error => {
      console.error(`Error setting video ${videoId}:`, error);
      // Log error but don't throw
      return Promise.resolve();  // Continue processing even if Firestore fails
    });
}

export async function isVideoNew(videoId: string) {
  try {
    console.log(`Checking if video is new: ${videoId}`);
    const video = await getVideo(videoId);
    const isNew = video?.status === undefined;
    console.log(`Video ${videoId} is new: ${isNew}`);
    return isNew;
  } catch (error) {
    console.error(`Error checking if video is new: ${videoId}`, error);
    return true;  // Assume new on error
  }
}
