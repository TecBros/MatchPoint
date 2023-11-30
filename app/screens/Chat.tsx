import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

// Import Screens
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useAuth } from '../AuthContext';
import styles from '../Styles';

interface Chat {
  id: string;
  user1: string;
  user2: string;
}

const ChatOverview: React.FC = () => {
  const { currentUser } = useAuth();
  const navigation = useNavigation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

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

  type ChatStackParamList = {
    Chat: undefined;
    Account: undefined;
    ChatInterface: {
      player1: string;
      player2: string;
    };
  };

  const handleChatPress = (chat: Chat) => {
    (navigation as any).navigate('ChatInterface', {
      player1: chat.user1,
      player2: chat.user2,
    });
  };  

  return (
    <View style={styles.chatContainer}>
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
    </View>
  );
};

export default ChatOverview;
