//Imports
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  DocumentData
} from 'firebase/firestore';

//Import Screens
import styles from '../Styles'; 

const Ranking = () => {
  const [players, setPlayers] = useState<DocumentData[]>([]);

  useEffect(() => {
    // Get a Firestore instance
    const db = getFirestore();
    
    // Reference to the 'users' collection in Firestore
    const playersCollection = collection(db, 'users');
    
    // Query to retrieve players ordered by points in descending order
    const playersQuery = query(playersCollection, orderBy('points', 'desc'));

    // Subscribe to changes in the players' collection
    const unsubscribe = onSnapshot(playersQuery, (querySnapshot) => {
      // Extract player data from the query snapshot and update the state
      const playersList = querySnapshot.docs.map((doc) => doc.data());
      setPlayers(playersList);
    });

    // Unsubscribe from the query when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

  return (
    <View style={styles.RankContainer}>
      <View style={styles.RankHeader}>
        <Text style={styles.RankHeaderText}>Rank       Username</Text>
        <Text style={styles.RankHeaderText}>Points</Text>
      </View>

      {players.map((player, index) => (
        <View style={styles.RankRow} key={index}>
          <Text style={styles.RankText}>{index + 1}       {player.username}</Text>
          <Text style={styles.RankText}>{parseInt(player.points).toString()}</Text>
        </View>
      ))}
    </View>
  );
};

export default Ranking;
