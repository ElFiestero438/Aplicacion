import React, { useEffect, useState } from 'react';

import { Image, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from '@react-navigation/stack';

import { Ionicons } from '@expo/vector-icons';

import { onAuthStateChanged } from "firebase/auth";

import { auth } from '../src/services/firebaseService';

import { AuthContext } from '../navigation/AuthContext';

import { useTheme } from '../navigation/ThemeContext';

import SplashScreen from '../src/screens/SplashScreen';

import RegisterScreen from '../src/screens/auth/RegisterScreen';

import LoginScreen from '../src/screens/auth/LoginScreen';

import WelcomeScreen from '../src/screens/onboarding/WelcomeScreen';

import SleepScreen from '../src/screens/onboarding/SleepScreen';

import WakeUpScreen from '../src/screens/onboarding/WakeUpScreen';

import GoalsScreen from '../src/screens/onboarding/GoalsScreen';

import FinishScreen from '../src/screens/onboarding/FinishScreen';

import HomeScreen from '../src/screens/HomeScreen';

import StatsScreen from '../src/screens/StatsScreen';

import SettingsScreen from '../src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const TabNavigator = ({ user }) => {

    const { darkMode } = useTheme();

    const COLORS = {
        primary: '#2563EB',
        primaryDark: '#1D4ED8',

        background:
            darkMode
                ? '#0F172A'
                : '#F3F4F6',

        white:
            darkMode
                ? '#111827'
                : '#FFFFFF',

        text:
            darkMode
                ? '#FFFFFF'
                : '#111827',

        gray:
            darkMode
                ? '#94A3B8'
                : '#9CA3AF',
    };

    return (

        <Tab.Navigator
            screenOptions={({ route }) => ({

                headerShown: false,

                tabBarHideOnKeyboard: true,

                tabBarActiveTintColor: COLORS.primary,

                tabBarInactiveTintColor: COLORS.gray,

                tabBarStyle: {
                    position: 'absolute',
                    height: 75,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: COLORS.white,

                    borderTopWidth: 0,

                    elevation: 0,

                    shadowColor: '#000',

                    shadowOffset: {
                        width: 0,
                        height: -4,
                    },

                    shadowOpacity: 0.08,

                    shadowRadius: 10,

                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 2,
                },

                tabBarIcon: ({
                    color,
                    size,
                    focused
                }) => {

                    const iconSize =
                        focused ? size + 2 : size;

                    if (route.name === "Home") {

                        return (

                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name={
                                        focused
                                            ? 'home'
                                            : 'home-outline'
                                    }
                                    size={iconSize}
                                    color={color}
                                />
                            </View>
                        );
                    }

                    if (route.name === "Stats") {

                        return (

                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name={
                                        focused
                                            ? 'stats-chart'
                                            : 'stats-chart-outline'
                                    }
                                    size={iconSize}
                                    color={color}
                                />
                            </View>
                        );
                    }

                    if (route.name === "Settings") {

                        return (

                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Ionicons
                                    name={
                                        focused
                                            ? 'settings'
                                            : 'settings-outline'
                                    }
                                    size={iconSize}
                                    color={color}
                                />
                            </View>
                        );
                    }

                    if (user?.photoURL) {

                        return (

                            <Image
                                source={{
                                    uri: user.photoURL
                                }}
                                style={{
                                    width: focused ? 32 : 28,
                                    height: focused ? 32 : 28,
                                    borderRadius: 50,

                                    borderWidth: focused ? 2 : 0,
                                    borderColor: COLORS.primary,
                                }}
                            />
                        );
                    }

                    return (

                        <Ionicons
                            name={
                                focused
                                    ? 'person'
                                    : 'person-outline'
                            }
                            size={iconSize}
                            color={color}
                        />
                    );
                },
            })}
        >

            <Tab.Screen
    name="Home"
    component={HomeScreen}
    options={{
        title: "Habitos"
    }}
/>

<Tab.Screen
    name="Stats"
    component={StatsScreen}
    options={{
        title: "Estadísticas"
    }}
/>

<Tab.Screen
    name="Settings"
    component={SettingsScreen}
    options={{
        title: "Ajustes"
    }}
/>

        </Tab.Navigator>
    );
};

const AppNavigator = () => {

    const { darkMode } = useTheme();

    const COLORS = {
        background:
            darkMode
                ? '#0F172A'
                : '#F3F4F6',
    };

    const [user, setUser] =
        useState(null);

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        onboardingComplete,
        setOnboardingComplete
    ] = useState(false);

    useEffect(() => {

        const initializeApp =
            async () => {

                try {

                    const onboarding =
                        await AsyncStorage.getItem(
                            "onboardingComplete"
                        );

                    setOnboardingComplete(
                        onboarding === "true"
                    );

                } catch (error) {

                    console.log(error);
                }

                const unsubscribe =
                    onAuthStateChanged(
                        auth,
                        (u) => {

                            setUser(u);

                            setIsLoading(false);
                        }
                    );

                return unsubscribe;
            };

        const unsubscribePromise =
            initializeApp();

        return () => {

            unsubscribePromise.then(
                (unsubscribe) => {

                    if (unsubscribe) {

                        unsubscribe();
                    }
                }
            );
        };

    }, []);

    if (isLoading) {

        return <SplashScreen />;
    }

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser
            }}
        >

            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyle: {
                        backgroundColor:
                            COLORS.background,
                    },
                }}
            >

                {!onboardingComplete ? (

                    <>
                        <Stack.Screen
                            name="Welcome"
                            component={WelcomeScreen}
                        />

                        <Stack.Screen
                            name="Sleep"
                            component={SleepScreen}
                        />

                        <Stack.Screen
                            name="WakeUp"
                            component={WakeUpScreen}
                        />

                        <Stack.Screen
                            name="Goals"
                            component={GoalsScreen}
                        />

                        <Stack.Screen
                            name="Finish"
                            component={FinishScreen}
                        />

                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />

                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                        />
                    </>

                ) : !user ? (

                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        />

                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                        />
                    </>

                ) : (

                    <Stack.Screen
                        name="Main"
                    >
                        {() => (
                            <TabNavigator
                                user={user}
                            />
                        )}
                    </Stack.Screen>

                )}

            </Stack.Navigator>

        </AuthContext.Provider>
    );
};

export default AppNavigator;