// Importing necessary components from React Native and Firebase
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, KeyboardAvoidingView, Modal, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import styles from '../Styles';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import * as Location from 'expo-location';


// Registration component
const Registration = () => {
    // Navigation hook for navigating between screens
    const navigation = useNavigation<NavigationProp<{ Login: undefined }>>();

    // State hooks for form inputs and modal visibility
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAgePickerVisible, setAgePickerVisible] = useState(false);
    const [isSkillLevelPickerVisible, setSkillLevelPickerVisible] = useState(false);
    const generateUserID = () => {
        const uniqueNumber = Date.now(); // Aktuelle Zeit in Millisekunden
        return `userID${uniqueNumber}`;
    };
    // Function to handle user sign-up
    const signUp = async () => {
        if (!email || !password || !username || !age || !skillLevel) {
            alert('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const uid = userCredential.user.uid; // Get the UID of the newly created user
    
            // Assigning points based on skill level
            const points = skillLevel === 'Anfänger' ? 0 :
                           skillLevel === 'Mittel' ? 250 :
                           skillLevel === 'Fortgeschritten' ? 500 :
                           skillLevel === 'Experte' ? 750 : 0;
    
            // Creating a new user document in Firestore with the UID as the document ID
            const userDocRef = doc(FIREBASE_DB, "users", uid);
            const userDoc = {
                email,
                username,
                age: parseInt(age),
                skillLevel,
                isReady: 0,
                points,
            };
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
    
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            await setDoc(userDocRef, { ...userDoc, location: { latitude, longitude } }, { merge: true });
            alert('Registration successful! Check your emails and complete your profile!');
        } catch (error: any) {
            console.log(error);
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    // Render component
    return (
        <View style={styles.Authcontainer}>
            <KeyboardAvoidingView behavior="padding">
                <Text style={styles.Authtitle}>Jetzt Registrieren!</Text>

                {/* Input fields */}
                <TextInput style={styles.Authinput} placeholder="Benutzername" onChangeText={setUsername} value={username} />
                <TextInput style={styles.Authinput} placeholder="Email" onChangeText={setEmail} value={email} />
                <TextInput style={styles.Authinput} placeholder="Passwort" onChangeText={setPassword} value={password} secureTextEntry={true} />

                {/* Age picker */}
                <TouchableOpacity onPress={() => setAgePickerVisible(true)} style={styles.pickerTrigger}>
                    <Text style={styles.pickerTriggerText}>{age || 'Bitte gebe dein Alter an!'}</Text>
                </TouchableOpacity>
                <Modal visible={isAgePickerVisible} transparent={true} animationType="slide" onRequestClose={() => setAgePickerVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Picker selectedValue={age} onValueChange={(itemValue) => { setAge(itemValue); setAgePickerVisible(false); }} style={styles.pickerStyle} >
                                {[...Array(99).keys()].map((value) => <Picker.Item key={value} label={(value + 1).toString()} value={(value + 1).toString()} />)}
                            </Picker>
                        </View>
                    </View>
                </Modal>

                {/* Skill level picker */}
                <TouchableOpacity onPress={() => setSkillLevelPickerVisible(true)} style={styles.pickerTrigger}>
                    <Text>{skillLevel || 'Bitte wähle deine Spielstärke aus!'}</Text>
                </TouchableOpacity>
                <Modal visible={isSkillLevelPickerVisible} transparent={true} animationType="slide" onRequestClose={() => setSkillLevelPickerVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Picker selectedValue={skillLevel} onValueChange={(itemValue) => { setSkillLevel(itemValue); setSkillLevelPickerVisible(false); }} style={styles.pickerStyle}>
                                <Picker.Item label="Anfänger" value="Anfänger" />
                                <Picker.Item label="Mittel" value="Mittel" />
                                <Picker.Item label="Fortgeschritten" value="Fortgeschritten" />
                                <Picker.Item label="Experte" value="Experte" />
                            </Picker>
                        </View>
                    </View>
                </Modal>

                {/* Action buttons */}
                {loading ? (
                    <ActivityIndicator size="large" color="purple" />
                ) : (
                    <View style={styles.Authbutton}>
                        <TouchableOpacity style={styles.sendButton} onPress={signUp}>
                            <Text style={styles.sendButtonText}>Registrieren</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sendButton} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.sendButtonText}>Bereits ein Konto vorhanden?</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Registration;
