import {
    createNativeStackNavigator
} from "@react-navigation/native-stack";

import WelcomeScreen from "../src/screens/onboarding/WelcomeScreen";

import SleepScreen from "../src/screens/onboarding/SleepScreen";

import WakeUpScreen from "../src/screens/onboarding/WakeUpScreen";

import GoalsScreen from "../src/screens/onboarding/GoalsScreen";

import FinishScreen from "../src/screens/onboarding/FinishScreen";

const Stack =
    createNativeStackNavigator();

const OnboardingNavigator = () => {

    return (

        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >

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

        </Stack.Navigator>
    );
};

export default OnboardingNavigator;