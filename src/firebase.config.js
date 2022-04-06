 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDDMRByx8rKS2VFVhn_mWmE6guezHSzRTg",
  authDomain: "house-marketplace-app-6beb1.firebaseapp.com",
  projectId: "house-marketplace-app-6beb1",
  storageBucket: "house-marketplace-app-6beb1.appspot.com",
  messagingSenderId: "703134756857",
  appId: "1:703134756857:web:7a4d1dec9462df8d4c1728"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore()