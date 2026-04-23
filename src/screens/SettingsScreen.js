import { useNavigation } from "@react-navigation/native";
import colors from "../constants/colors";
import { View, Text, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseService";

const SettingsScreen = () => {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            await signOut(auth);

            Alert.alert(
                'Sesión cerrada',
                'Has cerrado sesión correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () =>
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }]
                            })
                    }
                ]
            );

        } catch (error) {
            console.log('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar la sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Ajustes</Text>

            <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout} 
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                )}
            </TouchableOpacity>

        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: colors.danger,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 10,
        width: "100%",
        alignItems: "center"
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 'bold',
    },
};

export default SettingsScreen;