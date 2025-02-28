// Firebase'i CDN üzerinden yükleyeceğiz
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    addDoc, 
    doc, 
    deleteDoc, 
    where, 
    getDoc, 
    updateDoc, 
    setDoc,
    limit 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Firebase yapılandırması
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firebase fonksiyonlarını ve referansları global olarak tanımla
window.db = db;
window.auth = auth;
window.firestore = {
    collection: collection,
    getDocs: getDocs,
    query: query,
    orderBy: orderBy,
    addDoc: addDoc,
    doc: doc,
    deleteDoc: deleteDoc,
    where: where,
    getDoc: getDoc,
    updateDoc: updateDoc,
    setDoc: setDoc,
    limit: limit
};

// Firebase modülünü dışa aktar
export { 
    db, 
    auth, 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    addDoc, 
    doc, 
    deleteDoc, 
    where, 
    getDoc, 
    updateDoc, 
    setDoc,
    limit 
}; 