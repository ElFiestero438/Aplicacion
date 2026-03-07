import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../src/screens/SplashScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createNativeStackNavigator();

const TabNavigator = () => {
    const {user} = useAuth();
    return (
        <Tab.Navigator initialRouteName='Home'
        screenOptions ={({route})}=>({
            tabBarIcon: ({color, size,focused}) => {
                let iconName;
                if (route.name === "Home") {
                        iconName = focused ? 'home' : 'home-outline';
                }else if(route.name === "Settings") {
                        iconName = focused ? 'settings' : 'settings-outline';
                }else if(route.name === "User") {
                        iconName = focused ? 'person' : 'person-outline';
                }
        })>
        </Tab.Navigator>
    )
}

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='Splash' component={SplashScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
        </Stack.Navigator>
    )
}

const AppNavigator = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsuscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsuscribe();
    },[]);

    const authContextValue ={
        user,
        setUser,
        isLoading,
        setIsLoading,
    };

    if(isLoading){
        return <SplashScreen/>;//el null se reemplazará por el splash screen
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <Stack.Navigator initialRouteName='Splash'>
                <Stack.Screen name='Splash' component={SplashScreen} />
                <Stack.Screen name='Register' component={RegisterScreen} />
                <Stack.Screen name='Login' component={LoginScreen} />

            </Stack.Navigator>
        </AuthContext.Provider>   
    );
}