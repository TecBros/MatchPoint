// Importing necessary libraries and components
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getFirestore,
  DocumentData
} from 'firebase/firestore';

// Importing shared styles
import styles from '../Styles'; 

// Ranking component to display player rankings
const Ranking = () => {
  const [players, setPlayers] = useState<DocumentData[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const playersCollection = collection(db, 'users');
    const playersQuery = query(playersCollection, orderBy('points', 'desc'));

    // Subscribing to updates in the players' collection
    const unsubscribe = onSnapshot(playersQuery, (querySnapshot) => {
      const playersList = querySnapshot.docs.map((doc) => doc.data());
      setPlayers(playersList);
    });

    return () => {
      unsubscribe();
    };
  }, []); 

  return (
    <View style={styles.RankContainer}>
      <View style={styles.RankHeader}>
        <Text style={styles.RankHeaderText}>Rank       Username</Text>
        <Text style={styles.RankHeaderText}>Points</Text>
      </View>
  
      <ScrollView>
        {players.map((player, index) => (
          <View style={styles.RankRow} key={index}>
            <Text style={styles.RankText}>{index + 1}       {player.username}</Text>
            <Text style={styles.RankText}>{parseInt(player.points).toString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
};

export default Ranking;
