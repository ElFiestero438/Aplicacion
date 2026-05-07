import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDu7x5RdZmod32qPJkZau5nZF251kjYjqQ",
  authDomain: "appamigo-3e3ad.firebaseapp.com",
  projectId: "appamigo-3e3ad",
  storageBucket: "appamigo-3e3ad.firebasestorage.app",
  messagingSenderId: "339058270359",
  appId: "1:339058270359:web:0ac33b1888bdf35bc0c9d2"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };