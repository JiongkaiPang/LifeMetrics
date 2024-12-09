import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBY-tonFAlaDVYIUFJHhQeGiS4MCd16Q3c",
    authDomain: "lifemetrics-5c6b4.firebaseapp.com",
    projectId: "lifemetrics-5c6b4",
    storageBucket: "lifemetrics-5c6b4.firebasestorage.app",
    messagingSenderId: "449118429278",
    appId: "1:449118429278:web:939f01948a3dac7f7bd4cf"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 