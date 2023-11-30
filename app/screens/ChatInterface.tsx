// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';

// Importing screens for the application
import { useAuth } from '../AuthContext';
import { FIREBASE_DB } from '../../FirebaseConfig';
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import styles from '../Styles';
import isValidTennisScore from './Components/TennisScore'; 

// Interface for chat messages
interface Chat {
  id: string;
  user1: string;
  user2: string;
  lastMessage?: string;
}

// ChatPage component definition
const ChatPage: React.FC = () => {
  // State variables for chat functionality
  const { currentUser } = useAuth();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const navigation = useNavigation();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const route = useRoute();
  const { player1, player2 } = route.params as { player1: string, player2: string };
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentUserScore, setCurrentUserScore] = useState('');
  const [receiverScore, setReceiverScore] = useState('');

  // Function to toggle the visibility of the score overlay
  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  // Function to handle the submission of a tennis match score
  const handlePlayNow = async () => {
    if (
      currentUser &&
      currentUsername &&
      receiverScore &&
      currentUserScore
    ) {
      // Check if the score is a valid tennis score
      if (!isValidTennisScore(Number(currentUserScore), Number(receiverScore))) {
        Alert.alert(
          'Invalid Tennis Score',
          'Please check the scores. Valid scores are 6-0, 6-1, 6-2, 6-3, 6-4, 7-5, or 7-6.',
          [{ text: 'OK' }]
        );
        return;
      }
      const matchData = {
        sender: currentUsername,
        receiver:
          currentUsername === player1 ? player2 : player1,
        senderScore: Number(currentUserScore),
        receiverScore: Number(receiverScore),
        createdAt: Timestamp.now(), 
        status: 0, 
      };

      try {
        await addDoc(collection(FIREBASE_DB, 'matches'), matchData);
        console.log('Match data successfully saved!');
        // Close the overlay and reset scores
        toggleOverlay();
        setCurrentUserScore('');
        setReceiverScore('');
      } catch (error) {
        console.error('Error saving match data:', error);
      }
    } else {
      console.log('Missing information for the match');
    }
  };

  // Function to fetch current user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setCurrentUsername(userDocSnap.data().username);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const messagesRef = collection(FIREBASE_DB, 'messages');
    const q = query(
      messagesRef,
      where('sender', 'in', [player1, player2]),
      where('receiver', 'in', [player1, player2]),
      orderBy('timestamp')
    ); // Sort by timestamp

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      interface Message {
        id: string;
      }

      // Specify the type of fetchedMessages as an array of Message interface
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe(); // Cleanup function
  }, [player1, player2]);

  // Function to handle sending a chat message
  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '' && currentUsername) {
      const receiverUsername =
        currentUsername === player1 ? player2 : player1;

      const messageData = {
        sender: currentUsername,
        receiver: receiverUsername,
        message: inputMessage,
        timestamp: Timestamp.now(),
      };

      try {
        await addDoc(collection(FIREBASE_DB, 'messages'), messageData);
        console.log('Message sent!');
      } catch (error) {
        console.error('Error sending the message:', error);
      }

      setInputMessage('');
    }
  };

  // Function to determine if a message is from the current user
  const isMessageFromCurrentUser = (message: any) => {
    return message.sender === currentUsername;
  };

  return (
    <View style={styles.chatPageContainer}>
      <ScrollView contentContainerStyle={styles.messageContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubbleCommon,
              isMessageFromCurrentUser(message)
                ? styles.messageBubbleRight
                : styles.messageBubbleLeft,
            ]}
          >
            <Text
              style={
                isMessageFromCurrentUser(message)
                  ? styles.messageTextRight
                  : styles.messageTextLeft
              }
            >
              {message.message}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
          placeholder="Write a message"
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
        >
          <Text style={styles.sendButtonText}>Send!</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={toggleOverlay}>
          <Text style={styles.sendButtonText}>Play Now!</Text>
        </TouchableOpacity>
      </View>

      <Overlay
        isVisible={isOverlayVisible}
        onBackdropPress={toggleOverlay}
      >
        <View style={styles.overlayContainer}>
          <Text style={styles.overlayTitle}>Enter Game Score</Text>
          <TextInput
            style={styles.overlayInput}
            value={currentUserScore}
            onChangeText={setCurrentUserScore}
            placeholder="Your Score"
          />
          <TextInput
            style={styles.overlayInput}
            value={receiverScore}
            onChangeText={setReceiverScore}
            placeholder="Opponent Score"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handlePlayNow}
          >
            <Text style={styles.sendButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
  );
};

export default ChatPage;
