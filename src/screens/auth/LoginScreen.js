import colors from "../../constants/colors";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseService";

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Completa todos los campos');
            return;
        }

        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });

        } catch (error) {
            let errorMessage = 'Error al iniciar sesión';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Usuario no encontrado';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Correo inválido';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Sin conexión a internet';
                    break;
            }

            setError(errorMessage);
        }
    };

    return (
        <LinearGradient colors={colors.gradientePrimario} style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color={colors.iluminado} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Correo electrónico" 
                        placeholderTextColor={colors.suave}
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                        autoCapitalize="none" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color={colors.iluminado} />
                    <TextInput 
                        style={styles.input} 
                        placeholder="Contraseña" 
                        placeholderTextColor={colors.suave}
                        value={password} 
                        onChangeText={setPassword} 
                        secureTextEntry 
                    />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Crear cuenta</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.iluminado,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        color: colors.iluminado,
    },
    loginButton: {
        backgroundColor: colors.variante5,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.iluminado,
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkText: {
        color: colors.iluminado,
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: colors.alerta,
        marginBottom: 10,
    },
});

export default LoginScreen;