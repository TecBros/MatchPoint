//Imports
import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
} from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

//Import Screens
import { FIREBASE_DB } from '../../FirebaseConfig'; 
import { useAuth } from '../AuthContext';
import styles from '../Styles'; 
import { Overlay } from 'react-native-elements'; 
import isValidTennisScore from './Components/TennisScore'; 
import { updatePlayerScores } from './Components/PlayerScores'; 

interface Match {
  id: string;
  receiver: string;
  sender: string;
  status: number;
  senderScore: number;
  receiverScore: number; 
}

// Accessing the current user from the authentication context
const Notifications: React.FC = () => {
  // Define and initialize state variables 
  const { currentUser } = useAuth(); 
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const route = useRoute();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentUserScore, setCurrentUserScore] = useState('');
  const [receiverScore, setReceiverScore] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const handleAcceptMatch = async (match: Match) => {
    await acceptMatch(match); // Accept the match
    await updatePlayerScores(match.sender, match.receiver, match); // Update player scores
  };

  const acceptMatch = async (match: Match) => {
    // Update the status of the match to 1 to mark it as accepted
    const matchRef = doc(FIREBASE_DB, 'matches', match.id);
    try {
      await updateDoc(matchRef, {
        status: 1,
      });
      console.log('Match accepted');
      // Update the match list or perform other actions
    } catch (error) {
      console.error('Error updating the match:', error);
    }
  };

  useEffect(() => {
    // Update the user interface when a selected match changes
    if (selectedMatch) {
      setCurrentUserScore(selectedMatch.senderScore?.toString() ?? '');
      setReceiverScore(selectedMatch.receiverScore?.toString() ?? '');
    }
  }, [selectedMatch]);

  const changeResult = async () => {
    if (!selectedMatch) return;

    const newSenderScore = parseInt(currentUserScore);
    const newReceiverScore = parseInt(receiverScore);
    if (isNaN(newSenderScore) || isNaN(newReceiverScore)) {
      console.error('One of the scores is not a valid number.');
      return;
    }
    if (!isValidTennisScore(newSenderScore, newReceiverScore)) {
      Alert.alert(
        'Invalid Tennis Result',
        'Please check the scores. Valid results are 6-0, 6-1, 6-2, 6-3, 6-4, 7-5, or 7-6.',
        [{ text: 'OK' }]
      );
      return;
    }

    const matchRef = doc(FIREBASE_DB, 'matches', selectedMatch.id);

    try {
      await updateDoc(matchRef, {
        receiver: selectedMatch.sender,
        sender: selectedMatch.receiver,
        receiverScore: newSenderScore,
        senderScore: newReceiverScore,
        status: 0,
      });
      console.log('Result changed');
      toggleOverlay();
    } catch (error) {
      console.error('Error changing the result:', error);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUsername(userDocSnap.data().username); // Store the username
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    // Fetch matches when the currentUsername changes
    const fetchMatches = async () => {
      if (currentUsername) {
        const matchesQuery = query(
          collection(FIREBASE_DB, 'matches'),
          where('receiver', '==', currentUsername),
          where('status', '==', 0)
        );

        const querySnapshot = await getDocs(matchesQuery);
        const fetchedMatches = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data() as Omit<Match, 'id'> // Omitting the 'id' field from doc.data()
        }));

        setMatches(fetchedMatches);
      }
    };

    fetchMatches();
  }, [currentUsername]); // Added dependency on currentUsername

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const handleMatchPress = (match: Match) => {
    setSelectedMatch(match);
    setCurrentUserScore(match.senderScore?.toString() ?? '');
    setReceiverScore(match.receiverScore?.toString() ?? '');
    toggleOverlay();
  };

    return (
        <View style={styles.chatContainer}>
            {matches.map((match) => (
                <TouchableOpacity key={match.id} onPress={() => handleMatchPress(match)} style={styles.chatItem}>
                    <Text style={styles.chatText}>
                        {match.sender}: {selectedMatch?.senderScore}
                    </Text>
                    <Text style={styles.chatText}>
                        {match.receiver}: {selectedMatch?.receiverScore}
                    </Text>
                </TouchableOpacity>
            ))}

        <Overlay isVisible={isOverlayVisible} onBackdropPress={toggleOverlay}>
            <View style={styles.overlayContainer}>
            <Text style={styles.overlayTitle}>Spiel-Ergebnis bestätigen</Text>
                <Text style={styles.sendButtonText}>Gegner: {selectedMatch?.sender}</Text>
                    <TextInput
                        style={styles.overlayInput}
                        value={currentUserScore}
                        onChangeText={setCurrentUserScore}
                        placeholder="Dein Score"
                    />
                           <Text style={styles.sendButtonText}>Du: {selectedMatch?.receiver}</Text>
                    <TextInput
                        style={styles.overlayInput}
                        value={receiverScore}
                        onChangeText={setReceiverScore}
                        placeholder="Gegner Score"
                    />
             
                    <TouchableOpacity style={styles.sendButton} onPress={() => selectedMatch && handleAcceptMatch(selectedMatch)}>
                        <Text>Spiel annehmen</Text>
                    </TouchableOpacity>

                <TouchableOpacity style={styles.sendButton} onPress={changeResult}>
                        <Text>Ergebnis ändern</Text>
                    </TouchableOpacity>
            </View>
        </Overlay>
        </View>
    );
};

export default Notifications;
