import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
    Switch,
    Modal
} from "react-native";

import {
    useEffect,
    useState
} from "react";

import { signOut } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth } from "../services/firebaseService";

import colors from "../constants/colors";

import { useAuth } from "../../navigation/AuthContext";

import {
    escucharHabitos
} from "../services/habitService";

import {
    selectAndUploadImage
} from "../services/cloudinaryService";

import sqliteService from "../services/sqliteService";

const SettingsScreen = () => {

    const { user } = useAuth();

    const [loading, setLoading] =
        useState(false);

    const [totalHabitos,
        setTotalHabitos] =
        useState(0);

    const [completadosHoy,
        setCompletadosHoy] =
        useState(0);

    const [profileImage,
        setProfileImage] =
        useState(null);

    const [recordatorios,
        setRecordatorios] =
        useState(true);

    const [logoutModalVisible,
        setLogoutModalVisible] =
        useState(false);

    const [messageModalVisible,
        setMessageModalVisible] =
        useState(false);

    const [messageTitle,
        setMessageTitle] =
        useState("");

    const [messageText,
        setMessageText] =
        useState("");

    useEffect(() => {

        cargarPreferencias();

        let unsubscribe =
            () => {};

        if (user) {

            unsubscribe =
                escucharHabitos(
                    user,
                    (data) => {

                        const lista =
                            data || [];

                        setTotalHabitos(
                            lista.length
                        );

                        const completados =
                            lista.filter(
                                h => h.completadoHoy
                            ).length;

                        setCompletadosHoy(
                            completados
                        );
                    }
                );

        } else {

            unsubscribe =
                sqliteService.subscribe(
                    (lista) => {

                        const data =
                            lista || [];

                        setTotalHabitos(
                            data.length
                        );

                        const completados =
                            data.filter(
                                h => h.completadoHoy
                            ).length;

                        setCompletadosHoy(
                            completados
                        );
                    }
                );
        }

        return () => {

            unsubscribe();
        };

    }, [user]);

    const cargarPreferencias =
        async () => {

            try {

                const recordatoriosGuardados =
                    await AsyncStorage.getItem(
                        "recordatorios"
                    );

                if (
                    recordatoriosGuardados !==
                    null
                ) {

                    setRecordatorios(
                        recordatoriosGuardados ===
                        "true"
                    );
                }

            } catch (error) {

                console.log(error);
            }
        };

    const mostrarMensaje = (
        titulo,
        mensaje
    ) => {

        setMessageTitle(titulo);

        setMessageText(mensaje);

        setMessageModalVisible(true);
    };

    const toggleRecordatorios =
        async () => {

            try {

                const nuevoValor =
                    !recordatorios;

                setRecordatorios(
                    nuevoValor
                );

                await AsyncStorage.setItem(
                    "recordatorios",
                    nuevoValor.toString()
                );

                mostrarMensaje(
                    "Recordatorios",
                    nuevoValor
                        ? "Los recordatorios fueron activados correctamente 🔔"
                        : "Los recordatorios fueron desactivados."
                );

            } catch (error) {

                console.log(error);
            }
        };

    const mostrarResumen =
        () => {

            const pendientes =
                totalHabitos -
                completadosHoy;

            mostrarMensaje(
                "Resumen diario",
                `Hábitos totales: ${totalHabitos}\n\nCompletados: ${completadosHoy}\n\nPendientes: ${pendientes}`
            );
        };

    const inicial =
        user?.email
            ? user.email
                .charAt(0)
                .toUpperCase()
            : "?";

    const handleChangePhoto =
        async () => {

            const imageUrl =
                await selectAndUploadImage();

            if (!imageUrl) {

                mostrarMensaje(
                    "Error",
                    "No se pudo subir la imagen."
                );

                return;
            }

            setProfileImage(
                imageUrl
            );

            mostrarMensaje(
                "Foto actualizada",
                "Tu foto de perfil fue cambiada correctamente."
            );
        };

    const handleLogout =
        async () => {

            try {

                setLoading(true);

                await signOut(auth);

                setLogoutModalVisible(
                    false
                );

            } catch (error) {

                console.log(error);

                mostrarMensaje(
                    "Error",
                    "No se pudo cerrar sesión."
                );

            } finally {

                setLoading(false);
            }
        };

    return (

        <>

            <ScrollView
                style={styles.container}
                contentContainerStyle={{
                    paddingBottom: 60
                }}
                showsVerticalScrollIndicator={
                    false
                }
            >

                <Text
                    style={styles.header}
                >
                    Ajustes
                </Text>

                <TouchableOpacity
                    onPress={
                        handleChangePhoto
                    }
                    activeOpacity={0.8}
                    style={
                        styles.profileContainer
                    }
                >

                    {profileImage ? (

                        <Image
                            source={{
                                uri:
                                    profileImage
                            }}
                            style={
                                styles.avatar
                            }
                        />

                    ) : (

                        <View
                            style={
                                styles.avatar
                            }
                        >

                            <Text
                                style={
                                    styles.avatarText
                                }
                            >
                                {inicial}
                            </Text>

                        </View>
                    )}

                    <Text
                        style={
                            styles.changePhoto
                        }
                    >
                        Cambiar foto
                    </Text>

                </TouchableOpacity>

                <View
                    style={styles.infoCard}
                >

                    <Text
                        style={styles.name}
                    >
                        {user?.email?.split(
                            "@"
                        )[0]}
                    </Text>

                    <Text
                        style={styles.email}
                    >
                        {user?.email}
                    </Text>

                </View>

                <View
                    style={
                        styles.statsContainer
                    }
                >

                    <View
                        style={styles.statBox}
                    >

                        <Text
                            style={
                                styles.statNumber
                            }
                        >
                            {totalHabitos}
                        </Text>

                        <Text
                            style={
                                styles.statLabel
                            }
                        >
                            Hábitos
                        </Text>

                    </View>

                    <View
                        style={styles.statBox}
                    >

                        <Text
                            style={
                                styles.statNumber
                            }
                        >
                            {
                                completadosHoy
                            }
                        </Text>

                        <Text
                            style={
                                styles.statLabel
                            }
                        >
                            Hoy
                        </Text>

                    </View>

                </View>

                <View style={styles.section}>

                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Herramientas
                    </Text>

                    <View
                        style={styles.option}
                    >

                        <Text
                            style={
                                styles.optionText
                            }
                        >
                            🔔 Recordatorios
                        </Text>

                        <Switch
                            value={
                                recordatorios
                            }
                            onValueChange={
                                toggleRecordatorios
                            }
                            trackColor={{
                                false:
                                    "#d1d5db",
                                true:
                                    colors.primary
                            }}
                        />

                    </View>

                    <TouchableOpacity
                        style={styles.option}
                        activeOpacity={0.8}
                        onPress={
                            mostrarResumen
                        }
                    >

                        <Text
                            style={
                                styles.optionText
                            }
                        >
                            📊 Ver resumen diario
                        </Text>

                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    style={
                        styles.logoutButton
                    }
                    onPress={() =>
                        setLogoutModalVisible(
                            true
                        )
                    }
                    disabled={loading}
                    activeOpacity={0.85}
                >

                    {loading ? (

                        <ActivityIndicator
                            color="#fff"
                        />

                    ) : (

                        <Text
                            style={
                                styles.logoutText
                            }
                        >
                            Cerrar sesión
                        </Text>
                    )}

                </TouchableOpacity>

            </ScrollView>

            <Modal
                visible={
                    logoutModalVisible
                }
                transparent
                animationType="fade"
            >

                <View
                    style={
                        styles.modalOverlay
                    }
                >

                    <View
                        style={
                            styles.customModal
                        }
                    >

                        <Text
                            style={
                                styles.modalEmoji
                            }
                        >
                            👋
                        </Text>

                        <Text
                            style={
                                styles.modalTitle
                            }
                        >
                            Cerrar sesión
                        </Text>

                        <Text
                            style={
                                styles.modalDescription
                            }
                        >
                            ¿Seguro que deseas salir de tu cuenta?
                        </Text>

                        <View
                            style={
                                styles.modalButtons
                            }
                        >

                            <TouchableOpacity
                                style={
                                    styles.cancelButton
                                }
                                onPress={() =>
                                    setLogoutModalVisible(
                                        false
                                    )
                                }
                            >

                                <Text
                                    style={
                                        styles.cancelButtonText
                                    }
                                >
                                    Cancelar
                                </Text>

                            </TouchableOpacity>

                            <TouchableOpacity
                                style={
                                    styles.confirmButton
                                }
                                onPress={
                                    handleLogout
                                }
                            >

                                <Text
                                    style={
                                        styles.confirmButtonText
                                    }
                                >
                                    Salir
                                </Text>

                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

            </Modal>

            <Modal
                visible={
                    messageModalVisible
                }
                transparent
                animationType="fade"
            >

                <View
                    style={
                        styles.modalOverlay
                    }
                >

                    <View
                        style={
                            styles.customModal
                        }
                    >

                        <Text
                            style={
                                styles.modalEmoji
                            }
                        >
                            ✨
                        </Text>

                        <Text
                            style={
                                styles.modalTitle
                            }
                        >
                            {messageTitle}
                        </Text>

                        <Text
                            style={
                                styles.modalDescription
                            }
                        >
                            {messageText}
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.confirmButtonFull
                            }
                            onPress={() =>
                                setMessageModalVisible(
                                    false
                                )
                            }
                        >

                            <Text
                                style={
                                    styles.confirmButtonText
                                }
                            >
                                Entendido
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </Modal>

        </>
    );
};

const styles = {

    container: {
        flex: 1,
        backgroundColor:
            "#f5f7fb",
        paddingHorizontal: 20,
        paddingTop: 20
    },

    header: {
        fontSize: 34,
        fontWeight: "800",
        color: "#111",
        marginBottom: 25
    },

    profileContainer: {
        alignItems: "center",
        marginBottom: 20
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 999,
        backgroundColor:
            colors.primary,
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },

        shadowOpacity: 0.12,

        shadowRadius: 10,

        elevation: 6
    },

    avatarText: {
        color: "#fff",
        fontSize: 40,
        fontWeight: "800"
    },

    changePhoto: {
        marginTop: 12,
        color:
            colors.primary,
        fontWeight: "600",
        fontSize: 15
    },

    infoCard: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 22,
        marginBottom: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },

        shadowOpacity: 0.06,

        shadowRadius: 8,

        elevation: 3
    },

    name: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111",
        marginBottom: 5
    },

    email: {
        color: "#666",
        fontSize: 15
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        marginBottom: 25
    },

    statBox: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 24,
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },

        shadowOpacity: 0.06,

        shadowRadius: 8,

        elevation: 3
    },

    statNumber: {
        fontSize: 28,
        fontWeight: "800",
        color:
            colors.primary,
        marginBottom: 6
    },

    statLabel: {
        color: "#666",
        fontSize: 14,
        fontWeight: "600"
    },

    section: {
        marginBottom: 30
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        marginBottom: 15
    },

    option: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 18,
        marginBottom: 12,

        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },

        shadowOpacity: 0.05,

        shadowRadius: 6,

        elevation: 2
    },

    optionText: {
        fontSize: 16,
        color: "#111",
        fontWeight: "600"
    },

    logoutButton: {
        backgroundColor: "#ff3b30",

        paddingVertical: 18,

        borderRadius: 20,

        alignItems: "center",

        marginBottom: 80,

        shadowColor: "#ff3b30",

        shadowOffset: {
            width: 0,
            height: 4
        },

        shadowOpacity: 0.2,

        shadowRadius: 8,

        elevation: 5
    },

    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },

    modalOverlay: {
        flex: 1,
        backgroundColor:
            "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24
    },

    customModal: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 28,
        alignItems: "center"
    },

    modalEmoji: {
        fontSize: 52,
        marginBottom: 12
    },

    modalTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111",
        marginBottom: 10
    },

    modalDescription: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 26
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        width: "100%"
    },

    cancelButton: {
        width: "48%",
        paddingVertical: 16,
        borderRadius: 18,
        backgroundColor: "#f1f5f9",
        alignItems: "center"
    },

    confirmButton: {
        width: "48%",
        paddingVertical: 16,
        borderRadius: 18,
        backgroundColor: "#ff3b30",
        alignItems: "center"
    },

    confirmButtonFull: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 18,
        backgroundColor:
            colors.primary,
        alignItems: "center"
    },

    cancelButtonText: {
        color: "#111",
        fontWeight: "700",
        fontSize: 15
    },

    confirmButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15
    }
};

export default SettingsScreen;