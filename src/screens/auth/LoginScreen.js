import colors from "../../constants/colors";

import { useState } from "react";

import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import {
    signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../../services/firebaseService";

const LoginScreen = () => {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigation = useNavigation();

    const handleLogin = async () => {

        if (!email.trim() || !password.trim()) {

            setError("Completa todos los campos");

            return;
        }

        setError("");

        try {

            await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password.trim()
            );

        } catch (error) {

            let errorMessage =
                "Error al iniciar sesión";

            switch (error.code) {

                case "auth/user-not-found":
                    errorMessage =
                        "Usuario no encontrado";
                    break;

                case "auth/wrong-password":
                case "auth/invalid-credential":
                    errorMessage =
                        "Credenciales incorrectas";
                    break;

                case "auth/invalid-email":
                    errorMessage =
                        "Correo inválido";
                    break;

                case "auth/network-request-failed":
                    errorMessage =
                        "Sin conexión a internet";
                    break;

                case "auth/too-many-requests":
                    errorMessage =
                        "Demasiados intentos";
                    break;
            }

            setError(errorMessage);
        }
    };

    return (

        <LinearGradient
            colors={["#f5f7fb", "#eef7f1"]}
            style={styles.container}
        >

            <KeyboardAvoidingView
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
                style={styles.content}
            >

                <View style={styles.logoContainer}>

                    <View style={styles.logoCircle}>

                        <Ionicons
                            name="leaf"
                            size={38}
                            color="#fff"
                        />

                    </View>

                    <Text style={styles.appName}>
                        Better Habits
                    </Text>

                    <Text style={styles.subtitle}>
                        Mejora tu vida un hábito a la vez
                    </Text>

                </View>

                <View style={styles.card}>

                    <Text style={styles.title}>
                        Bienvenido
                    </Text>

                    <Text style={styles.description}>
                        Inicia sesión para continuar
                    </Text>

                    <View style={styles.inputContainer}>

                        <Ionicons
                            name="mail-outline"
                            size={22}
                            color="#666"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Correo electrónico"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                    </View>

                    <View style={styles.inputContainer}>

                        <Ionicons
                            name="lock-closed-outline"
                            size={22}
                            color="#666"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                    </View>

                    {error ? (

                        <Text style={styles.errorText}>
                            {error}
                        </Text>

                    ) : null}

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.85}
                    >

                        <Text style={styles.buttonText}>
                            Entrar
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate(
                                "Register"
                            )
                        }
                    >

                        <Text style={styles.linkText}>
                            Crear cuenta
                        </Text>

                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    content: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 25
    },

    logoContainer: {
        alignItems: "center",
        marginBottom: 35
    },

    logoCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#34c759",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#34c759",
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,

        elevation: 8
    },

    appName: {
        fontSize: 30,
        fontWeight: "800",
        color: "#111",
        marginTop: 18
    },

    subtitle: {
        fontSize: 15,
        color: "#666",
        marginTop: 6
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 28,
        padding: 24,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,

        elevation: 5
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111"
    },

    description: {
        color: "#666",
        marginTop: 5,
        marginBottom: 25,
        fontSize: 15
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f7fb",
        borderRadius: 16,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ececec"
    },

    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 10,
        color: "#111",
        fontSize: 15
    },

    loginButton: {
        backgroundColor: "#34c759",
        paddingVertical: 17,
        borderRadius: 18,
        alignItems: "center",
        marginTop: 10,

        shadowColor: "#34c759",
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,

        elevation: 5
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },

    linkText: {
        color: "#34c759",
        textAlign: "center",
        marginTop: 20,
        fontWeight: "600"
    },

    errorText: {
        color: "#ff3b30",
        marginBottom: 10,
        marginTop: -5
    }
});

export default LoginScreen;