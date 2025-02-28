const { contextBridge } = require('electron');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, where, getDoc, updateDoc, setDoc } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Firebase fonksiyonlarını window objesine ekle
contextBridge.exposeInMainWorld('firebaseApi', {
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
    setDoc
}); 