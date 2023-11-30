// Importing necessary components from React Native and Firebase
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import styles from '../Styles';

// Login component for user authentication
const Login = () => {
    // Type definition for navigation parameters
    type RootStackParamList = {
        Register: undefined;
    };
    
    // Hook for navigating between screens
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // State hooks for email, password, and loading indicator
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Firebase authentication instance
    const auth = FIREBASE_AUTH;

    // Function to validate form inputs
    const validateForm = () => email !== '' && password !== '';

    // Function to handle user sign-in
    const signIn = async () => {
        if (!validateForm()) {
            alert('Please fill out all fields.');
            return;
        }
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log('Sign-in successful:', response);
        } catch (error: any) {
            console.error('Sign-in failed:', error);
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Render login interface
    return (
        <View style={styles.Authcontainer}>
            <KeyboardAvoidingView behavior="padding">
                <Text style={styles.Authtitle}>Login</Text>
                <TextInput style={styles.Authinput} placeholder="Email" onChangeText={setEmail} value={email} />
                <TextInput style={styles.Authinput} placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry={true} />

                {loading ? (
                    <ActivityIndicator size="large" color="blue" />
                ) : (
                    <View style={styles.Authbutton}>
                        <TouchableOpacity style={styles.sendButton} onPress={signIn}>
                            <Text style={styles.sendButtonText}>Einloggen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sendButton} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.sendButtonText}>Jetzt Registrieren</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;