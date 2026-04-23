import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from "firebase/auth";

import { auth } from '../src/services/firebaseService';
import { AuthContext } from '../navigation/AuthContext';

import SplashScreen from '../src/screens/SplashScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import HomeScreen from '../src/screens/HomeScreen';
import UserScreen from '../src/screens/UserScreen';
import SettingsScreen from '../src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({ user }) => {
    return(
        <Tab.Navigator 
            screenOptions={({route})=>({
                tabBarIcon: ({color, size, focused})=>{
                    if(route.name === "Home"){
                        return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
                    }

                    if(route.name === "Settings"){
                        return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
                    }

                    if(route.name === "User"){
                        if(user?.photoURL){
                            return (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: size / 2,
                                    }}
                                />
                            );
                        }
                        return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: '#0077B6',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="User" component={UserScreen}/>
            <Tab.Screen name="Settings" component={SettingsScreen}/>
        </Tab.Navigator>
    )
};

const AppNavigator = () => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setIsLoading(false);
        });
        return unsubscribe;
    },[]);

    if(isLoading){
        return <SplashScreen/>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main">
                        {() => <TabNavigator user={user} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen}/>
                        <Stack.Screen name="Register" component={RegisterScreen}/>
                    </>
                )}
            </Stack.Navigator>
        </AuthContext.Provider>
    );
};

export default AppNavigator;