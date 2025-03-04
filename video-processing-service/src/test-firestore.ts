import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
initializeApp({credential: credential.applicationDefault()});

const firestore = new Firestore();

async function testFirestore() {
  try {
    // Try to write a test document
    console.log('Attempting to write to Firestore...');
    const result = await firestore.collection('test').doc('test-doc').set({
      timestamp: new Date(),
      message: 'Test successful'
    });
    
    console.log('Write successful:', result);
    
    // Try to read the document
    console.log('Attempting to read from Firestore...');
    const doc = await firestore.collection('test').doc('test-doc').get();
    
    if (doc.exists) {
      console.log('Read successful:', doc.data());
    } else {
      console.log('Document does not exist');
    }
    
  } catch (error) {
    console.error('Firestore test failed:', error);
  }
}

testFirestore(); 