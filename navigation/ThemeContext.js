import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext =
    createContext();

export const ThemeProvider = ({
    children
}) => {

    const [darkMode,
        setDarkMode] =
        useState(false);

    useEffect(() => {

        cargarTema();

    }, []);

    const cargarTema =
        async () => {

            try {

                const guardado =
                    await AsyncStorage.getItem(
                        "darkMode"
                    );

                if (
                    guardado !== null
                ) {

                    setDarkMode(
                        guardado ===
                        "true"
                    );
                }

            } catch (error) {

                console.log(error);
            }
        };

    const toggleDarkMode =
        async () => {

            try {

                const nuevo =
                    !darkMode;

                setDarkMode(
                    nuevo
                );

                await AsyncStorage.setItem(
                    "darkMode",
                    nuevo.toString()
                );

            } catch (error) {

                console.log(error);
            }
        };

    return (

        <ThemeContext.Provider
            value={{
                darkMode,
                toggleDarkMode
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme =
    () =>
        useContext(
            ThemeContext
        );