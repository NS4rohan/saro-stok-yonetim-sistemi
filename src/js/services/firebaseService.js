// Firebase fonksiyonlarını al
const {
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
} = window.firestore;

// Firestore veritabanı referansını al
const db = window.db;

export {
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
    limit,
    db
}; 