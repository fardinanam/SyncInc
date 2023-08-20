// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDcIUeQAWgl6PmGCem497gcCPPFyqoIfFM",
    authDomain: "syncinc-3d861.firebaseapp.com",
    projectId: "syncinc-3d861",
    storageBucket: "syncinc-3d861.appspot.com",
    messagingSenderId: "404253910105",
    appId: "1:404253910105:web:b30866c59c45a0ea6c3d48",
    measurementId: "G-4XW1ME7ND8"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);

export default storage;