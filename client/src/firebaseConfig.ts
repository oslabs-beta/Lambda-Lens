import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBGgrKdxoI8vUcdnbWD1lD4pDkhEawLxkc",
    authDomain: "lambda-lens.firebaseapp.com",
    projectId: "lambda-lens",
    storageBucket: "lambda-lens.firebasestorage.app",
    messagingSenderId: "395532899337",
    appId: "1:395532899337:web:5a1f794afeff2d8a9654d8",
    measurementId: "G-54B4Q56ZZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);
