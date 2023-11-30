// Importing necessary libraries and components
import { doc } from 'firebase/firestore';

// Importing screens for the application
import { FIREBASE_DB } from '../../../FirebaseConfig';
import { getDocumentSnapshot, updateDocument, listenForCollectionChanges } from './firebaseUtils';

// Get user data by email
export const getUserData = async (email: string) => {
    return getDocumentSnapshot('users', email);
};

// Update user's ready status
export const updateReadyStatus = async (userId: string, isReady: boolean) => {
    await updateDocument('users', userId, { isReady: isReady ? 1 : 0 });
};

// Listen for changes in ready status of users
export const listenForReadyStatus = (email: string, setIsReady: Function) => {
    const userRef = doc(FIREBASE_DB, 'users', email);
    return listenForCollectionChanges('users', ['isReady', '==', 1], (snapshot) => {
        const readyPlayers = [];
        for (const doc of snapshot.docs) {
            if (doc.id !== email) {
                readyPlayers.push({ email: doc.id, username: doc.data().username });
            }
        }
        setIsReady(readyPlayers);
    });
};