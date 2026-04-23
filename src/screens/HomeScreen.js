import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import colors from "../constants/colors";
import { auth } from "../services/firebaseService";
import { onAuthStateChanged } from "firebase/auth";

import {
    inicializarHabitos,
    crearHabito,
    escucharHabitos,
    toggleHabito,
    eliminarHabito,
    actualizarHoraHabito
} from "../services/habitService";

const HomeScreen = () => {

    const [habitos, setHabitos] = useState([]);
    const [texto, setTexto] = useState("");
    const [hora, setHora] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        let unsubscribeHabitos = () => {};

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {

            setUser(currentUser);

            if (!currentUser) {
                setHabitos([]);
                return;
            }

            await inicializarHabitos(currentUser);

            const unsub = escucharHabitos(currentUser, (data) => {
                setHabitos(data || []);
            });

            if (unsub) unsubscribeHabitos = unsub;
        });

        return () => {
            unsubscribeAuth();
            unsubscribeHabitos();
        };
    }, []);

    const handleCrear = () => {
        if (!texto.trim() || !user) return;

        crearHabito(user, texto, hora || "00:00");
        setTexto("");
        setHora("");
    };

    const handleEliminar = (id) => {
        Alert.alert("Eliminar hábito", "¿Seguro?", [
            { text: "Cancelar" },
            { text: "Eliminar", onPress: () => eliminarHabito(id) }
        ]);
    };

    const handleCambiarHora = (id) => {
        Alert.prompt(
            "Cambiar hora",
            "Formato HH:MM",
            (text) => {
                if (text) actualizarHoraHabito(id, text);
            }
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={{
                padding: 15,
                marginVertical: 6,
                backgroundColor: item?.completadoHoy ? colors.success : colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border
            }}
            onPress={() => toggleHabito(item.id, item.completadoHoy)}
            onLongPress={() => handleEliminar(item.id)}
        >
            <Text style={{
                color: colors.textPrimary,
                fontWeight: "bold",
                textDecorationLine: item?.completadoHoy ? "line-through" : "none"
            }}>
                {item?.titulo}
            </Text>

            <TouchableOpacity onPress={() => handleCambiarHora(item.id)}>
                <Text style={{
                    color: colors.textSecondary,
                    marginTop: 5
                }}>
                    Hora: {item?.hora}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Mis Hábitos</Text>

            <TextInput
                placeholder="Nuevo hábito..."
                value={texto}
                onChangeText={setTexto}
                style={styles.input}
                placeholderTextColor={colors.textSecondary}
            />

            <TextInput
                placeholder="Hora (HH:MM)"
                value={hora}
                onChangeText={setHora}
                style={styles.input}
                placeholderTextColor={colors.textSecondary}
            />

            <TouchableOpacity style={styles.button} onPress={handleCrear}>
                <Text style={styles.buttonText}>Agregar</Text>
            </TouchableOpacity>

            <FlatList
                data={habitos || []}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />

        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 24,
        marginBottom: 15,
        fontWeight: "bold",
        color: colors.textPrimary
    },
    input: {
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.textPrimary
    },
    button: {
        backgroundColor: colors.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "bold"
    }
};

export default HomeScreen;