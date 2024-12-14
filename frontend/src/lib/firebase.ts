import { initializeApp, FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCUUlePZyLZUi2qjJbiSPRG3jLiXrOpyRc",
  authDomain: "codefest-c6abe.firebaseapp.com",
  databaseURL: "https://codefest-c6abe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "codefest-c6abe",
  storageBucket: "codefest-c6abe.firebasestorage.app",
  messagingSenderId: "652240425924",
  appId: "1:652240425924:web:fd208175677a0eba8f4a91",
  measurementId: "G-0JL2SCEWQJ"
};

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);