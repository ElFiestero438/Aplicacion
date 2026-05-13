import { useState } from "react";

import colors from "../../constants/colors";

import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

import { auth } from "../../services/firebaseService";

import { LinearGradient } from "expo-linear-gradient";

import { Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [name, setName] = useState("");

    const [error, setError] = useState("");

    const navigation = useNavigation();

    const handleRegister = async () => {

        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            setError(
                "Todos los campos son obligatorios"
            );

            return;
        }

        if (password !== confirmPassword) {

            setError(
                "Las contraseñas no coinciden"
            );

            return;
        }

        if (password.length < 6) {

            setError(
                "La contraseña debe tener mínimo 6 caracteres"
            );

            return;
        }

        setError("");

        try {

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email.trim(),
                    password.trim()
                );

            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name
            });

            Alert.alert(
                "Éxito",
                "Cuenta creada correctamente",
                [
                    {
                        text: "Continuar",
                        onPress: () =>
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: "Login"
                                    }
                                ]
                            })
                    }
                ]
            );

        } catch (error) {

            let errorMessage =
                "Error al registrar usuario";

            switch (error.code) {

                case "auth/email-already-in-use":
                    errorMessage =
                        "Ese correo ya está registrado";
                    break;

                case "auth/invalid-email":
                    errorMessage =
                        "Correo inválido";
                    break;

                case "auth/weak-password":
                    errorMessage =
                        "Contraseña muy débil";
                    break;

                case "auth/network-request-failed":
                    errorMessage =
                        "Sin conexión a internet";
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
                style={{ flex: 1 }}
            >

                <ScrollView
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                >

                    <View
                        style={styles.logoContainer}
                    >

                        <View
                            style={styles.logoCircle}
                        >

                            <Ionicons
                                name="person-add"
                                size={36}
                                color="#fff"
                            />

                        </View>

                        <Text style={styles.appName}>
                            Crear cuenta
                        </Text>

                        <Text style={styles.subtitle}>
                            Empieza a construir mejores hábitos
                        </Text>

                    </View>

                    <View style={styles.card}>

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

                            <Ionicons
                                name="person-outline"
                                size={22}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Nombre completo"
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />

                        </View>

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

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

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

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

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

                            <Ionicons
                                name="shield-checkmark-outline"
                                size={22}
                                color="#666"
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar contraseña"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={
                                    setConfirmPassword
                                }
                                secureTextEntry
                            />

                        </View>

                        {error ? (

                            <Text
                                style={
                                    styles.errorText
                                }
                            >
                                {error}
                            </Text>

                        ) : null}

                        <TouchableOpacity
                            style={
                                styles.registerButton
                            }
                            onPress={handleRegister}
                            activeOpacity={0.85}
                        >

                            <Text
                                style={
                                    styles.buttonText
                                }
                            >
                                Crear cuenta
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(
                                    "Login"
                                )
                            }
                        >

                            <Text
                                style={styles.linkText}
                            >
                                ¿Ya tienes cuenta?
                                Inicia sesión
                            </Text>

                        </TouchableOpacity>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 25,
        paddingVertical: 40
    },

    logoContainer: {
        alignItems: "center",
        marginBottom: 30
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
        marginTop: 6,
        textAlign: "center"
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

    registerButton: {
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
        marginTop: -5,
        textAlign: "center"
    }
});

export default RegisterScreen;