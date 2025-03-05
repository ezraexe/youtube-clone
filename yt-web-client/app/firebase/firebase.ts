// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    User
} from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyA7j3pTAeEYCxod_Gvxz-WpRiqn2LDh7Tc",
  authDomain: "yt-clone-a3001.firebaseapp.com",
  projectId: "yt-clone-a3001",
  appId: "1:515423371775:web:02512ecff16406888267ca",
  measurementId: "G-E9T1F20F9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const functions = getFunctions(app);

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());

}


export function signOut() {
    return auth.signOut(); 
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}