// Importing screens for the application
import { doc, getDoc, onSnapshot, collection, query, where, updateDoc, getFirestore } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../FirebaseConfig';

// Function to get a document snapshot from a collection
export const getDocumentSnapshot = async (collectionName: string, docId: string) => {
    const docRef = doc(FIREBASE_DB, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
};

// Function to update a document in a collection
export const updateDocument = async (collectionName: string, docId: string, data: any) => {
    const docRef = doc(FIREBASE_DB, collectionName, docId);
    await updateDoc(docRef, data);
};

// Function to listen for changes in a collection based on a condition
export const listenForCollectionChanges = (collectionName: string, condition: any, callback: (snapshot: any) => void) => {
    const ref = collection(FIREBASE_DB, collectionName);
    const q = query(ref, where('fieldName', '==', 'fieldValue')); // Modify 'fieldName' and 'fieldValue' as needed
    return onSnapshot(q, callback);
};

