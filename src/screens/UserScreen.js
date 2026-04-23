import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import colors from "../constants/colors";
import { useAuth } from "../../navigation/AuthContext";
import { useEffect, useState } from "react";
import { escucharHabitos } from "../services/habitService";
import { selectAndUploadImage } from "../services/cloudinaryService";

const UserScreen = () => {

    const { user } = useAuth();

    const [totalHabitos, setTotalHabitos] = useState(0);
    const [completadosHoy, setCompletadosHoy] = useState(0);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = escucharHabitos(user, (data) => {
            const lista = data || [];

            setTotalHabitos(lista.length);

            const completados = lista.filter(h => h.completadoHoy).length;
            setCompletadosHoy(completados);
        });

        return unsubscribe;
    }, [user]);

    const inicial = user?.email ? user.email.charAt(0).toUpperCase() : "?";

    const handleChangePhoto = async () => {
        console.log("CLICK DETECTADO"); // 🔥 DEBUG

        const imageUrl = await selectAndUploadImage();

        console.log("URL RECIBIDA:", imageUrl); // 🔥 DEBUG

        if (!imageUrl) {
            Alert.alert("Error", "No se pudo subir la imagen");
            return;
        }

        setProfileImage(imageUrl);

        Alert.alert("Listo", "Foto de perfil actualizada");
    };

    return (
        <View style={styles.container}>

            {/* AVATAR */}
            <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{inicial}</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* 🔥 TEXTO CLAVE (esto era lo que te faltaba visualmente) */}
            <Text style={styles.changePhotoText}>
                Cambiar foto
            </Text>

            <Text style={styles.title}>Perfil</Text>

            <Text style={styles.email}>{user?.email}</Text>

            <View style={styles.statsContainer}>
                
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{totalHabitos}</Text>
                    <Text style={styles.statLabel}>Hábitos</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{completadosHoy}</Text>
                    <Text style={styles.statLabel}>Completados hoy</Text>
                </View>

            </View>

        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
        padding: 20
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    avatarText: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "bold"
    },
    changePhotoText: {
        color: colors.primary,
        marginBottom: 15,
        fontSize: 14
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: 5
    },
    email: {
        color: colors.textSecondary,
        marginBottom: 25
    },
    statsContainer: {
        flexDirection: "row",
        marginBottom: 30
    },
    statBox: {
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        marginHorizontal: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.border
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "bold",
        color: colors.primary
    },
    statLabel: {
        color: colors.textSecondary
    }
};

export default UserScreen;