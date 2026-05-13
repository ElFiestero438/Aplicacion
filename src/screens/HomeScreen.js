import { useEffect, useState } from "react";

import {
    useTheme
} from "../../navigation/ThemeContext";

import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    StatusBar,
    StyleSheet,
    Alert
} from "react-native";

import colors from "../constants/colors";

import { auth } from "../services/firebaseService";

import { onAuthStateChanged } from "firebase/auth";

import sqliteService from "../services/sqliteService";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
    inicializarHabitos,
    crearHabito,
    escucharHabitos,
    toggleHabito,
    eliminarHabito,
    actualizarHoraHabito
} from "../services/habitService";

const HomeScreen = () => {

    const {
        darkMode
    } = useTheme();

    const theme = {
        background:
            darkMode
                ? "#0F172A"
                : colors.background,

        surface:
            darkMode
                ? "#1E293B"
                : colors.surface,

        textPrimary:
            darkMode
                ? "#FFFFFF"
                : colors.textPrimary,

        textSecondary:
            darkMode
                ? "#94A3B8"
                : colors.textSecondary,

        border:
            darkMode
                ? "#334155"
                : colors.border
    };

    const [habitos, setHabitos] =
        useState([]);

    const [user, setUser] =
        useState(null);

    const [modalVisible,
        setModalVisible] =
        useState(false);

    const [modalAcciones,
        setModalAcciones] =
        useState(false);

    const [nuevoHabito,
        setNuevoHabito] =
        useState("");

    const [habitoSeleccionado,
        setHabitoSeleccionado] =
        useState(null);

    const [hora, setHora] =
        useState(new Date());

    const [showPickerCrear,
        setShowPickerCrear] =
        useState(false);

    const [showPickerModal,
        setShowPickerModal] =
        useState(false);

    const habitosBase = [

        {
            titulo: "Despertar temprano",
            hora: "06:00"
        },

        {
            titulo: "Hacer ejercicio",
            hora: "07:00"
        },

        {
            titulo: "Leer 20 minutos",
            hora: "21:00"
        },

        {
            titulo: "Planear el día",
            hora: "08:00"
        }
    ];

    const completados =
        habitos.filter(
            h => h.completadoHoy
        ).length;

    const progreso =
        habitos.length > 0
            ? completados / habitos.length
            : 0;

    const porcentaje =
        Math.round(progreso * 100);

    const formatHora = (date) => {

        const h = date
            .getHours()
            .toString()
            .padStart(2, "0");

        const m = date
            .getMinutes()
            .toString()
            .padStart(2, "0");

        return `${h}:${m}`;
    };

    useEffect(() => {

        sqliteService.init();

        let unsubscribeHabitos =
            () => {};

        let unsubscribeLocal =
            () => {};

        const unsubscribeAuth =
            onAuthStateChanged(
                auth,
                async (currentUser) => {

                    setUser(currentUser);

                    if (!currentUser) {

                        unsubscribeLocal =
                            sqliteService.subscribe(
                                (data) => {

                                    setHabitos(
                                        data || []
                                    );
                                }
                            );

                        return;
                    }

                    await inicializarHabitos(
                        currentUser
                    );

                    unsubscribeHabitos =
                        escucharHabitos(
                            currentUser,
                            (data) => {

                                setHabitos(
                                    data || []
                                );
                            }
                        );
                }
            );

        return () => {

            unsubscribeAuth();

            unsubscribeHabitos();

            unsubscribeLocal();
        };

    }, []);

    const agregarHabito =
        async () => {

            if (!nuevoHabito.trim())
                return;

            const nombreHabito =
                nuevoHabito.trim();

            const yaExiste =
                habitos.some(
                    h =>
                        h.titulo
                            .toLowerCase()
                            .trim() ===
                        nombreHabito
                            .toLowerCase()
                            .trim()
                );

            if (yaExiste) {

                setModalVisible(false);

                setNuevoHabito("");

                return;
            }

            const horaFormateada =
                formatHora(hora);

            try {

                if (user) {

                    await crearHabito(
                        user,
                        nombreHabito,
                        horaFormateada,
                        true
                    );

                } else {

                    await sqliteService.insertarHabito(
                        nombreHabito,
                        horaFormateada
                    );
                }

                setNuevoHabito("");

                setHora(new Date());

                setModalVisible(false);

                setShowPickerCrear(
                    false
                );

            } catch (error) {

                console.log(error);
            }
        };

    const accionesHabito = (
        item
    ) => {

        setHabitoSeleccionado(
            item
        );

        if (item?.hora) {

            const [h, m] =
                item.hora.split(":");

            const nuevaFecha =
                new Date();

            nuevaFecha.setHours(
                parseInt(h)
            );

            nuevaFecha.setMinutes(
                parseInt(m)
            );

            setHora(nuevaFecha);
        }

        setModalAcciones(true);
    };

    const completar = async () => {

        if (!habitoSeleccionado)
            return;

        try {

            const ahora =
                new Date();

            const horaActual =
                ahora.getHours() * 60 +
                ahora.getMinutes();

            const [horaHabito, minutoHabito] =
                habitoSeleccionado.hora
                    .split(":")
                    .map(Number);

            const minutosHabito =
                horaHabito * 60 +
                minutoHabito;

            if (
                !habitoSeleccionado.completadoHoy &&
                horaActual < minutosHabito
            ) {

                Alert.alert(
                    "Muy temprano",
                    `Este hábito solo puede completarse después de las ${habitoSeleccionado.hora}`
                );

                return;
            }

            const hoy =
                new Date()
                    .toISOString()
                    .split("T")[0];

            if (user) {

                await toggleHabito(
                    habitoSeleccionado.id,
                    habitoSeleccionado.completadoHoy,
                    hoy
                );

            } else {

                await sqliteService.toggleHabitoLocal(
                    habitoSeleccionado.id,
                    hoy
                );
            }

            setModalAcciones(false);

            setHabitoSeleccionado(null);

        } catch (error) {

            console.log(error);
        }
    };

    const eliminarHabitoAccion =
        async () => {

            if (!habitoSeleccionado)
                return;

            try {

                if (user) {

                    await eliminarHabito(
                        habitoSeleccionado.id
                    );

                } else {

                    await sqliteService.eliminarHabitoLocal(
                        habitoSeleccionado.id
                    );
                }

                setModalAcciones(
                    false
                );

                setHabitoSeleccionado(
                    null
                );

            } catch (error) {

                console.log(error);
            }
        };

    const confirmarCambioHora =
        async () => {

            if (!habitoSeleccionado)
                return;

            const nuevaHora =
                formatHora(hora);

            try {

                if (user) {

                    await actualizarHoraHabito(
                        habitoSeleccionado.id,
                        nuevaHora
                    );

                } else {

                    await sqliteService.actualizarHoraLocal(
                        habitoSeleccionado.id,
                        nuevaHora
                    );
                }

                setShowPickerModal(
                    false
                );

                setModalAcciones(
                    false
                );

                setHabitoSeleccionado(
                    null
                );

            } catch (error) {

                console.log(error);
            }
        };

    const onChangeHora = (
        event,
        selectedDate
    ) => {

        if (selectedDate) {

            setHora(selectedDate);
        }

        setShowPickerCrear(
            false
        );

        setShowPickerModal(
            false
        );
    };

    const agregarHabitoBase =
        async (base) => {

            const existe =
                habitos.some(
                    h =>
                        h.titulo
                            .toLowerCase()
                            .trim() ===
                        base.titulo
                            .toLowerCase()
                            .trim()
                );

            if (existe)
                return;

            try {

                if (user) {

                    await crearHabito(
                        user,
                        base.titulo,
                        base.hora,
                        true
                    );

                } else {

                    await sqliteService.insertarHabito(
                        base.titulo,
                        base.hora
                    );
                }

            } catch (error) {

                console.log(error);
            }
        };

    const renderItem = ({
        item
    }) => {

        return (

            <TouchableOpacity
                activeOpacity={0.85}
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            item.completadoHoy
                                ? darkMode
                                    ? "#052E16"
                                    : "#ecfdf3"
                                : theme.surface,

                        borderColor:
                            item.completadoHoy
                                ? colors.success
                                : theme.border
                    }
                ]}
                onPress={() =>
                    accionesHabito(
                        item
                    )
                }
            >

                <View
                    style={
                        styles.cardLeft
                    }
                >

                    <View
                        style={[
                            styles.checkCircle,

                            item.completadoHoy &&
                            styles.checkCircleActive
                        ]}
                    >

                        <Text
                            style={
                                styles.checkText
                            }
                        >
                            ✓
                        </Text>

                    </View>

                    <View>

                        <Text
                            style={[
                                styles.cardTitle,
                                {
                                    color:
                                        theme.textPrimary
                                },

                                item.completadoHoy && {
                                    textDecorationLine:
                                        "line-through"
                                }
                            ]}
                        >
                            {
                                item.titulo
                            }
                        </Text>

                        <Text
                            style={[
                                styles.cardTime,
                                {
                                    color:
                                        theme.textSecondary
                                }
                            ]}
                        >
                            ⏰ {item.hora}
                        </Text>

                    </View>

                </View>

            </TouchableOpacity>
        );
    };

    return (

        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                        theme.background
                }
            ]}
        >

            <StatusBar
                barStyle={
                    darkMode
                        ? "light-content"
                        : "dark-content"
                }
            />

            <FlatList
                data={habitos}
                renderItem={
                    renderItem
                }
                keyExtractor={(
                    item
                ) =>
                    item.id.toString()
                }
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    padding: 22,
                    paddingBottom: 160
                }}
                ListHeaderComponent={

                    <>

                        <View
                            style={
                                styles.header
                            }
                        >

                            <Text
                                style={[
                                    styles.logo,
                                    {
                                        color:
                                            theme.textPrimary
                                    }
                                ]}
                            >
                                Better Habits
                            </Text>

                            <Text
                                style={[
                                    styles.subtitle,
                                    {
                                        color:
                                            theme.textSecondary
                                    }
                                ]}
                            >
                                Construye una mejor
                                versión de ti
                            </Text>

                        </View>

                        <View
                            style={
                                styles.progressCard
                            }
                        >

                            <Text
                                style={
                                    styles.progressTitle
                                }
                            >
                                Progreso diario
                            </Text>

                            <Text
                                style={
                                    styles.progressNumber
                                }
                            >
                                {porcentaje}%
                            </Text>

                            <View
                                style={
                                    styles.progressBar
                                }
                            >

                                <View
                                    style={[
                                        styles.progressFill,
                                        {
                                            width:
                                                `${porcentaje}%`
                                        }
                                    ]}
                                />

                            </View>

                            <Text
                                style={
                                    styles.progressText
                                }
                            >
                                {
                                    completados
                                }{" "}
                                de{" "}
                                {
                                    habitos.length
                                }{" "}
                                hábitos completados
                            </Text>

                        </View>

                        <Text
                            style={[
                                styles.sectionTitle,
                                {
                                    color:
                                        theme.textPrimary
                                }
                            ]}
                        >
                            Recomendados
                        </Text>

                        <View
                            style={
                                styles.recommendedContainer
                            }
                        >

                            {habitosBase.map(
                                (
                                    base,
                                    index
                                ) => {

                                    const existe =
                                        habitos.some(
                                            h =>
                                                h.titulo
                                                    .toLowerCase()
                                                    .trim() ===
                                                base.titulo
                                                    .toLowerCase()
                                                    .trim()
                                        );

                                    return (

                                        <TouchableOpacity
                                            key={
                                                index
                                            }
                                            activeOpacity={
                                                existe
                                                    ? 1
                                                    : 0.85
                                            }
                                            disabled={
                                                existe
                                            }
                                            style={[
                                                styles.recommendedCard,
                                                {
                                                    backgroundColor:
                                                        theme.surface,

                                                    borderColor:
                                                        existe
                                                            ? colors.success
                                                            : theme.border,

                                                    opacity:
                                                        existe
                                                            ? 0.6
                                                            : 1
                                                }
                                            ]}
                                            onPress={() =>
                                                agregarHabitoBase(
                                                    base
                                                )
                                            }
                                        >

                                            <Text
                                                style={[
                                                    styles.recommendedTitle,
                                                    {
                                                        color:
                                                            theme.textPrimary
                                                    }
                                                ]}
                                            >
                                                {
                                                    base.titulo
                                                }
                                            </Text>

                                            <Text
                                                style={[
                                                    styles.recommendedTime,
                                                    {
                                                        color:
                                                            theme.textSecondary
                                                    }
                                                ]}
                                            >
                                                ⏰{" "}
                                                {
                                                    base.hora
                                                }
                                            </Text>

                                        </TouchableOpacity>
                                    );
                                }
                            )}

                        </View>

                        <Text
                            style={[
                                styles.sectionTitle,
                                {
                                    marginTop: 28,
                                    color:
                                        theme.textPrimary
                                }
                            ]}
                        >
                            Tus hábitos
                        </Text>

                    </>
                }
            />

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.fab}
                onPress={() =>
                    setModalVisible(
                        true
                    )
                }
            >

                <Text
                    style={
                        styles.fabText
                    }
                >
                    +
                </Text>

            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    header: {
        marginTop: 10,
        marginBottom: 28
    },

    logo: {
        fontSize: 34,
        fontWeight: "800"
    },

    subtitle: {
        marginTop: 8,
        fontSize: 16
    },

    progressCard: {
        backgroundColor:
            colors.primary,
        borderRadius: 28,
        padding: 24,
        marginBottom: 28
    },

    progressTitle: {
        color: "#fff",
        fontSize: 16,
        opacity: 0.9
    },

    progressNumber: {
        color: "#fff",
        fontSize: 42,
        fontWeight: "800",
        marginTop: 10
    },

    progressBar: {
        height: 10,
        backgroundColor:
            "rgba(255,255,255,0.2)",
        borderRadius: 999,
        marginTop: 18,
        overflow: "hidden"
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#fff",
        borderRadius: 999
    },

    progressText: {
        marginTop: 14,
        color: "#fff",
        opacity: 0.9
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 18
    },

    recommendedContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent:
            "space-between"
    },

    recommendedCard: {
        width: "48%",
        borderRadius: 24,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1
    },

    recommendedTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10
    },

    recommendedTime: {},

    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1
    },

    cardLeft: {
        flexDirection: "row",
        alignItems: "center"
    },

    checkCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor:
            "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16
    },

    checkCircleActive: {
        backgroundColor:
            colors.success
    },

    checkText: {
        color: "#fff",
        fontWeight: "800"
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "700"
    },

    cardTime: {
        marginTop: 6
    },

    fab: {
        position: "absolute",
        right: 24,
        bottom: 95,

        width: 72,
        height: 72,
        borderRadius: 36,

        backgroundColor:
            colors.primary,

        justifyContent:
            "center",

        alignItems:
            "center",

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 6,
        },

        shadowOpacity: 0.18,

        shadowRadius: 10,

        elevation: 10,
    },

    fabText: {
        color: "#fff",
        fontSize: 34,
        fontWeight: "300",
        lineHeight: 36
    }
});

export default HomeScreen;