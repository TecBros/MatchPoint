// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import { Text, View, Button, TouchableOpacity, Modal, Image } from 'react-native';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { getDistance } from 'geolib';

// Importing screens for the application
import Level1Stadium from '../../assets/images/Level1Stadium.png';
import Level2Stadium from '../../assets/images/Level2Stadium.png';
import Level3Stadium from '../../assets/images/Level3Stadium.png';
import Level4Stadium from '../../assets/images/Level4Stadium.png';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { useAuth } from '../AuthContext'; 
import styles from '../Styles';

<Image source={Level1Stadium} style={styles.stadiumImage} />


// Home component to manage user interactions and state
const Home = () => {
  // State variables for user data and application status
  const { currentUser } = useAuth();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<number | null>(null);
  const [readyUsers, setReadyUsers] = useState<string[]>([]);
  const [chatStartedWith, setChatStartedWith] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<string>(''); 
  const [showOverlay, setShowOverlay] = useState(false); 

  // Effect to fetch and update user data 
  useEffect(() => {
    updateLevel();
    fetchUserData();
  }, [currentUser]);

  // Function to fetch user data from Firestore
  const fetchUserData = async () => {
    if (currentUser) {
      const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setIsReady(userDocSnap.data().isReady);
        setCurrentUsername(userDocSnap.data().username);
        const points = userDocSnap.data().points;
  
        let userLevel = '';
  
        if (points >= 0 && points < 250) {
          userLevel = 'Level 1';
        } else if (points >= 250 && points < 500) {
          userLevel = 'Level 2';
        } else if (points >= 500 && points < 750) {
          userLevel = 'Level 3';
        } else if (points >= 750) {
          userLevel = 'Level 4';
        }
  
        setUserLevel(userLevel);
      } else {
        console.log('No such document!');
      }
    }
  };
  
  // Function to update user level based on points
  const updateLevel = () => {
    if (currentUser && isReady !== null) {
      const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      getDoc(userDocRef)
        .then((userDocSnap) => {
          if (userDocSnap.exists()) {
            const points = userDocSnap.data().points;
            let userLevel = '';
  
            if (points >= 0 && points < 250) {
              userLevel = 'Level 1';
            } else if (points >= 250 && points < 500) {
              userLevel = 'Level 2';
            } else if (points >= 500 && points < 750) {
              userLevel = 'Level 3';
            } else if (points >= 750) {
              userLevel = 'Level 4';
            }
  
            setUserLevel(userLevel);
            console.log('User Level:', userLevel);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data: ', error);
        });
    }
  };
  
   // Mapping user levels to corresponding stadium images
  const images: { [key: string]: any } = {
    'Level 1': Level1Stadium,
    'Level 2': Level2Stadium,
    'Level 3': Level3Stadium,
    'Level 4': Level4Stadium,
  };

  // Function to render the correct stadium image based on user level
  const renderStadium = () => {
    const StadiumImage = images[userLevel];
    return StadiumImage ? <Image source={StadiumImage} style={styles.stadiumImage} /> : null;
  };
  
  // Function to handle user button click to find or cancel finding an opponent
  const handleButtonClick = async () => {
    if (currentUser) {
      const newStatus = isReady === 1 ? 0 : 1;
      const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      await updateDoc(userDocRef, { isReady: newStatus });
      setIsReady(newStatus);
      if (newStatus === 1) {
        await fetchReadyUsers();
      } else {
        setReadyUsers([]);
      }
    }
  };

  // Function to check if a chat already exists between two users
  const checkIfChatExists = async (opponentName: string) => {
    const q = query(
      collection(FIREBASE_DB, 'chats'),
      where('user1', 'in', [currentUsername, opponentName]),
      where('user2', 'in', [currentUsername, opponentName])
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; 
  };

  // Function to fetch users ready to play and sort them based on criteria
  const fetchReadyUsers = async () => {
    const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    const currentUserData = userDocSnap.exists() ? userDocSnap.data() : null;
    const q = query(collection(FIREBASE_DB, 'users'), where('isReady', '==', 1));
    const querySnapshot = await getDocs(q);
    let usersWithinRange = [];
  
    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      const username = userData.username;
      const points = userData.points;
      const userLocation = userData.location;
  
      // Check if the user is within 5 kilometers and if no chat exists
      if (currentUserData &&
          username !== currentUserData.username &&
          userLocation &&
          currentUserData.location &&
          getDistance(currentUserData.location, userLocation) <= 5000 &&
          !(await checkIfChatExists(username))) {
        usersWithinRange.push({ username, points });
      }
    }
  
    // Sort users within range by points difference
    usersWithinRange.sort((a, b) => {
      if (currentUserData) {
        return Math.abs(a.points - currentUserData.points) - Math.abs(b.points - currentUserData.points);
      }
      return 0;
    });
  
    // Create an array with the sorted usernames
    const sortedUsernames = usersWithinRange.map((user) => user.username);
    setReadyUsers(sortedUsernames);
  };

  // Function to render the play button for the first ready user
  const renderPlayButton = (username: string) => {
    return (
      <TouchableOpacity
        key={username}
        style={styles.sendButton}
        onPress={() => handleOpponentClick(username)}
      >
        <Text style={styles.Hometext}>{`Play against ${username} now!`}</Text>
      </TouchableOpacity>
    );
  };

  // Function to handle the click on an opponent and start a chat
  const handleOpponentClick = async (opponentName: string) => {
    if (currentUser && currentUsername) {
      const chatData = {
        user1: currentUsername,
        user2: opponentName,
      };
      await addDoc(collection(FIREBASE_DB, 'chats'), chatData);
      console.log('Chat started with:', opponentName);
      setChatStartedWith(opponentName); 
      setShowOverlay(true); 
    }
  };

  // Function to close the overlay and reset user's ready status
  const closeOverlay = async () => {
    setShowOverlay(false); 

    // Reset 'isReady' state to 0 when overlay is closed
    if (currentUser) {
      const userDocRef = doc(FIREBASE_DB, 'users', currentUser.uid);
      await updateDoc(userDocRef, { isReady: 0 });
      setIsReady(0);
      setReadyUsers([]); 
    }
  };

  return (
    <View style={styles.HomeContainer}>
           <View style={styles.stadiumContainer}>
        {renderStadium()}
      </View>

      <View style={styles.HomeButtons}>
        
        <View style={styles.Homebutton}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleButtonClick}
          >
            <Text style={styles.Hometext}>
              {isReady === 1 ? 'Please wait...' : 'Find an opponent!'}
            </Text>
          </TouchableOpacity>
        </View>

        {isReady === 1 && readyUsers.length > 0 && (
          <View style={styles.OpponentButton}>
            {renderPlayButton(readyUsers[0])}
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={showOverlay}
          onRequestClose={closeOverlay}
        >
          <View style={styles.overlayContainer2}>
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Chat with {chatStartedWith} has been created</Text>
              <Button title="Close" onPress={closeOverlay} />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default Home;