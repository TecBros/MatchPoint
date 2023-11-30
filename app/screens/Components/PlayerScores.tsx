// Imports
import {
  collection,
  query,
  where,
  getDocs,
  runTransaction,
} from 'firebase/firestore';

//Import Screens
import { FIREBASE_DB } from '../../../FirebaseConfig';

interface Match {
  id: string;
  receiver: string;
  sender: string;
  status: number;
  senderScore: number;
  receiverScore: number; 
}

// Function to update player scores in a transaction
export const updatePlayerScores = async (
  senderUsername: string,
  receiverUsername: string,
  match: Match
) => {
  try {
    // Start a transaction to ensure both points updates are performed atomically.
    await runTransaction(FIREBASE_DB, async (transaction) => {
      // Queries to retrieve user documents based on the username.
      const usersCollectionRef = collection(FIREBASE_DB, 'users');
      const senderQuery = query(usersCollectionRef, where('username', '==', senderUsername));
      const receiverQuery = query(usersCollectionRef, where('username', '==', receiverUsername));

      // Wait for query results.
      const senderDocs = await getDocs(senderQuery);
      const receiverDocs = await getDocs(receiverQuery);

      // Check if the documents exist.
      if (senderDocs.empty || receiverDocs.empty) {
        throw new Error('One of the players does not exist in the database.');
      }

      // The documents exist; we retrieve the first documents
      const senderDoc = senderDocs.docs[0];
      const receiverDoc = receiverDocs.docs[0];
      const senderData = senderDoc.data();
      const receiverData = receiverDoc.data();

      let senderPoints = senderData.points || 0;
      let receiverPoints = receiverData.points || 0;

      const pointDifference = match.senderScore - match.receiverScore;

      if (pointDifference > 0) {
        // Sender has won
        const pointsEarned = Math.min(50, 30 + pointDifference * 0.2);
        senderPoints += pointsEarned;
        receiverPoints -= Math.min(20, 30 + pointDifference * 0.2);
      } else if (pointDifference < 0) {
        // Receiver has won
        const pointsEarned = Math.min(50, 30 - pointDifference * 0.2);
        receiverPoints += pointsEarned;
        senderPoints -= Math.min(20, 30 - pointDifference * 0.2);
      }

      // Ensure points do not go below 0.
      senderPoints = Math.max(0, senderPoints);
      receiverPoints = Math.max(0, receiverPoints);

      // Update the sender and receiver documents with the new points.
      transaction.update(senderDoc.ref, { points: senderPoints });
      transaction.update(receiverDoc.ref, { points: receiverPoints });
    });

    console.log('Points updated successfully.');
  } catch (error) {
    console.error('Error updating points:', error);
  }
};
