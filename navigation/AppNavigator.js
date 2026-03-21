import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../src/screens/SplashScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import { onAuthStateChanged } from "firebase/auth";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createNativeStackNavigator();

const TabNavigator = () =>{
    const {user} = useAuth();

    return(
        <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={({route})=>({
                tabBarIcon: ({color, size, focused})=>{
                    let iconName;

                    if (route.name === "Home") {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if(route.name === "Settings"){
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if(route.name === "User"){
                        if (user?.photoURL) {
                            return (
                                <Image
                                    source={{ uri: user.photoURL }}
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: size / 2,
                                        borderWidth: focused ? 2 : 0,
                                        borderColor: focused ? '#0077B6' : 'transparent',
                                    }}
                                />
                            );
                        }
                        // Si no tiene foto, mostrar el icono por defecto
                        return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
                    } 
                    
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#0077B6',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name ="Home" component={HomeScreen} options={{tabBarLabel:'Home'}}/>
            <Tab.Screen name ="User" component={UserScreen} options={{tabBarLabel:'Usuario'}}/>
            <Tab.Screen name ="Settings" component={SettingsScreen} options={{tabBarLabel:'Ajustes'}}/>
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

export default AppNavigator;