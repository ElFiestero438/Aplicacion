import { StatusBar } from "expo-status-bar";

import {
    NavigationContainer
} from "@react-navigation/native";

import AppNavigator from "./navigation/AppNavigator";

import AppProvider from "./navigation/AppProvider";

import {
    ThemeProvider
} from "./navigation/ThemeContext";

export default function App() {

    return (

        <ThemeProvider>

            <AppProvider>

                <NavigationContainer>

                    <AppNavigator />

                    <StatusBar style="auto" />

                </NavigationContainer>

            </AppProvider>

        </ThemeProvider>
    );
}