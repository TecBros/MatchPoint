// Importing necessary libraries and components
import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

// Importing screens for the application
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useAuth } from '../AuthContext';
import styles from '../Styles';

// Interface definition for Chat
interface Chat {
  id: string;
  user1: string;
  user2: string;
}

// ChatOverview component
const ChatOverview: React.FC = () => {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  // Fetch user data on component mount or currentUser change
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

  // Fetch chats involving the current user
  useEffect(() => {
    const fetchChats = async () => {
      if (currentUsername) {
        const chatsUser1Query = query(
          collection(FIREBASE_DB, 'chats'),
          where('user1', '==', currentUsername)
        );
        const chatsUser2Query = query(
          collection(FIREBASE_DB, 'chats'),
          where('user2', '==', currentUsername)
        );

        const [user1Snapshot, user2Snapshot] = await Promise.all([
          getDocs(chatsUser1Query),
          getDocs(chatsUser2Query),
        ]);

        const fetchedChats = new Map<string, Chat>();
        user1Snapshot.forEach((doc) => {
          fetchedChats.set(doc.id, { id: doc.id, ...doc.data() as Omit<Chat, 'id'> });
        });
        user2Snapshot.forEach((doc) => {
          if (!fetchedChats.has(doc.id)) {
            fetchedChats.set(doc.id, { id: doc.id, ...doc.data() as Omit<Chat, 'id'> });
          }
        });

        setChats(Array.from(fetchedChats.values()));
      }
    };

    fetchChats();
  }, [currentUsername]);

  // Navigation parameter list for ChatStack
  type ChatStackParamList = {
    Chat: undefined;
    Account: undefined;
    ChatInterface: {
      player1: string;
      player2: string;
    };
  };

  // Function to handle pressing a chat item
  const handleChatPress = (chat: Chat) => {
    (navigation as any).navigate('ChatInterface', {
      player1: chat.user1,
      player2: chat.user2,
    });
  };  

  return (
    <View style={styles.chatContainer}>
      <ScrollView>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => handleChatPress(chat)}
          >
            <Text style={styles.chatText}>
              {chat.user1 === currentUsername ? chat.user2 : chat.user1}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noChatsText}>No chats available.</Text>
      )}
      </ScrollView>
    </View>
  );
};

export default ChatOverview;
