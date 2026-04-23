import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
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

const app = initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  auth = initializeAuth(app);
}

const db = getFirestore(app);

export { auth, db };