// Importing necessary libraries and components
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Importing screens for the application
import Login from './Authentification/login';
import Register from './Authentification/Register';
import Home from './screens/Home';
import Account from './screens/Account';
import Notification from './screens/Notification';
import Ranking from './screens/Ranking';
import Chat from './screens/Chat';
import ChatInterface from './screens/ChatInterface';
import { FIREBASE_AUTH } from '../FirebaseConfig';

// Initializing Stack and Tab navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Type definition for navigation props
type RootStackParamList = {
  Home: undefined;
  Account: undefined;
  Notification: undefined;
  ChatInterface: { player1: string, player2: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type ChatStackScreenProps = NativeStackNavigationProp<RootStackParamList, 'ChatInterface'>;


// Home stack screen component with navigation props
function HomeStackScreen({ navigation }: { navigation: NavigationProp }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Gegnersuche"
        component={Home}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <Icon name="user" size={25} color="black" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Icon name="bell" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Notification" component={Notification} />
    </Stack.Navigator>
  );
}

// Ranking stack screen component with navigation props
function RankingStackScreen({ navigation }: { navigation: NavigationProp }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Ranking"
        component={Ranking}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <Icon name="user" size={25} color="black" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Icon name="bell" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Notification" component={Notification} />
    </Stack.Navigator>
  );
}


// Chat stack screen component with navigation props
function ChatStackScreen({ navigation }: { navigation: ChatStackScreenProps }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Account')}>
              <Icon name="user" size={25} color="black" />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
              <Icon name="bell" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen
        name="ChatInterface"
        component={ChatInterface}
        initialParams={{ player1: 'validPlayer1', player2: 'validPlayer2' }}
      />
      
    </Stack.Navigator>
  );
}

// Component for the layout when the user is authenticated
function InsideComponent() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Rangliste"
        component={RankingStackScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="trophy" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Start"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatStackScreen}
        options={{
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Icon name="comments" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

// Main App component integrating Firebase authentication
export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, setUser);
    return unsubscribe; 
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen name="Inside" component={InsideComponent} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
