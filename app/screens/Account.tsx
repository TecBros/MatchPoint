// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Importing screens for the application
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import styles from '../Styles';

// Interface for RouterProps
interface RouterProps {
  navigation: NavigationProp<any, any>;
}

// Interface for User data
interface User {
  email: string | null;
  username: string | null;
  points: number | null;
  skillLevel: string | null;
  club: string | null;
  age: number | null;
}

// Account component
const Account = ({ }: RouterProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (currentUser) {
      fetchUserData(currentUser.uid);
    }
  }, []);

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    const userDocRef = doc(FIREBASE_DB, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setUser({
        email: userData.email,
        username: userData.username,
        points: userData.points,
        skillLevel: userData.skillLevel,
        club: userData.club,
        age: userData.age,
      });
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={styles.Authcontainer}>
      <View style={styles.inputContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{user?.username}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Points:</Text>
          <Text style={styles.value}>{user?.points}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Skill Level:</Text>
          <Text style={styles.value}>{user?.skillLevel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{user?.age}</Text>
        </View>
        <View style={styles.sendButton}>
          <TouchableOpacity style={styles.sendButton} onPress={handleLogout}>
            <Text style={styles.sendButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Account;