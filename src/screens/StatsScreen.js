import {
    View,
    Text,
    ScrollView
} from "react-native";

import {
    useEffect,
    useState
} from "react";

import {
    useTheme
} from "../../navigation/ThemeContext";

import colors from "../constants/colors";

import { useAuth } from "../../navigation/AuthContext";

import {
    escucharHabitos
} from "../services/habitService";

import sqliteService from "../services/sqliteService";

const StatsScreen = () => {

    const { user } = useAuth();

    const { darkMode } =
        useTheme();

    const [totalHabitos,
        setTotalHabitos] =
        useState(0);

    const [completadosHoy,
        setCompletadosHoy] =
        useState(0);

    const [pendientes,
        setPendientes] =
        useState(0);

    const [progreso,
        setProgreso] =
        useState(0);

    const [racha,
        setRacha] =
        useState(0);

    const backgroundColor =
        darkMode
            ? "#0f172a"
            : colors.background;

    const cardColor =
        darkMode
            ? "#1e293b"
            : colors.surface;

    const textColor =
        darkMode
            ? "#ffffff"
            : colors.textPrimary;

    const secondaryText =
        darkMode
            ? "#94a3b8"
            : colors.textSecondary;

    const achievementBackground =
        darkMode
            ? "#111827"
            : colors.textPrimary;

    useEffect(() => {

        let unsubscribe =
            () => {};

        const procesarHabitos =
            (lista) => {

                const data =
                    lista || [];

                const total =
                    data.length;

                const completados =
                    data.filter(
                        h => h.completadoHoy
                    ).length;

                const faltantes =
                    total - completados;

                const porcentaje =
                    total > 0
                        ? Math.round(
                            (
                                completados /
                                total
                            ) * 100
                        )
                        : 0;

                setTotalHabitos(total);

                setCompletadosHoy(
                    completados
                );

                setPendientes(
                    faltantes
                );

                setProgreso(
                    porcentaje
                );

                if (
                    porcentaje === 100
                ) {

                    setRacha(1);

                } else {

                    setRacha(0);
                }
            };

        if (user) {

            unsubscribe =
                escucharHabitos(
                    user,
                    procesarHabitos
                );

        } else {

            unsubscribe =
                sqliteService.subscribe(
                    procesarHabitos
                );
        }

        return () => {

            unsubscribe();
        };

    }, [user]);

    const mensajeMotivacion =
        () => {

            if (
                progreso === 100
            ) {

                return "Perfecto. Hoy dominaste tu rutina 🚀";
            }

            if (
                progreso >= 70
            ) {

                return "Excelente progreso, sigue así 🔥";
            }

            if (
                progreso >= 40
            ) {

                return "Ya comenzaste, no pares 💪";
            }

            return "Todo gran cambio empieza pequeño ✨";
        };

    return (

        <ScrollView
            style={[
                styles.container,
                {
                    backgroundColor:
                        backgroundColor
                }
            ]}
            showsVerticalScrollIndicator={
                false
            }
            contentContainerStyle={{
                paddingBottom: 140
            }}
        >

            <View
                style={styles.header}
            >

                <Text
                    style={[
                        styles.title,
                        {
                            color:
                                textColor
                        }
                    ]}
                >
                    Estadísticas
                </Text>

                <Text
                    style={[
                        styles.subtitle,
                        {
                            color:
                                secondaryText
                        }
                    ]}
                >
                    Sigue construyendo
                    tu mejor versión
                </Text>

            </View>

            <View
                style={
                    styles.heroCard
                }
            >

                <View>

                    <Text
                        style={
                            styles.heroLabel
                        }
                    >
                        Racha actual
                    </Text>

                    <Text
                        style={
                            styles.heroNumber
                        }
                    >
                        {racha} días
                    </Text>

                </View>

                <Text
                    style={
                        styles.heroEmoji
                    }
                >
                    🔥
                </Text>

            </View>

            <View
                style={[
                    styles.progressCard,
                    {
                        backgroundColor:
                            cardColor
                    }
                ]}
            >

                <View
                    style={
                        styles.progressTop
                    }
                >

                    <Text
                        style={[
                            styles.progressTitle,
                            {
                                color:
                                    textColor
                            }
                        ]}
                    >
                        Progreso diario
                    </Text>

                    <Text
                        style={
                            styles.progressPercent
                        }
                    >
                        {progreso}%
                    </Text>

                </View>

                <View
                    style={
                        styles.progressBackground
                    }
                >

                    <View
                        style={[
                            styles.progressFill,
                            {
                                width:
                                    `${progreso}%`
                            }
                        ]}
                    />

                </View>

                <Text
                    style={[
                        styles.progressMessage,
                        {
                            color:
                                secondaryText
                        }
                    ]}
                >
                    {
                        mensajeMotivacion()
                    }
                </Text>

            </View>

            <View
                style={styles.row}
            >

                <View
                    style={[
                        styles.smallCard,
                        {
                            backgroundColor:
                                cardColor
                        }
                    ]}
                >

                    <Text
                        style={
                            styles.cardEmoji
                        }
                    >
                        ✅
                    </Text>

                    <Text
                        style={
                            styles.cardNumber
                        }
                    >
                        {
                            completadosHoy
                        }
                    </Text>

                    <Text
                        style={[
                            styles.cardLabel,
                            {
                                color:
                                    secondaryText
                            }
                        ]}
                    >
                        Completados
                    </Text>

                </View>

                <View
                    style={[
                        styles.smallCard,
                        {
                            backgroundColor:
                                cardColor
                        }
                    ]}
                >

                    <Text
                        style={
                            styles.cardEmoji
                        }
                    >
                        ⏳
                    </Text>

                    <Text
                        style={
                            styles.cardNumber
                        }
                    >
                        {pendientes}
                    </Text>

                    <Text
                        style={[
                            styles.cardLabel,
                            {
                                color:
                                    secondaryText
                            }
                        ]}
                    >
                        Pendientes
                    </Text>

                </View>

            </View>

            <View
                style={[
                    styles.card,
                    {
                        backgroundColor:
                            cardColor
                    }
                ]}
            >

                <Text
                    style={[
                        styles.sectionTitle,
                        {
                            color:
                                textColor
                        }
                    ]}
                >
                    Resumen
                </Text>

                <View
                    style={
                        styles.summaryRow
                    }
                >

                    <Text
                        style={[
                            styles.summaryLabel,
                            {
                                color:
                                    secondaryText
                            }
                        ]}
                    >
                        Hábitos activos
                    </Text>

                    <Text
                        style={[
                            styles.summaryValue,
                            {
                                color:
                                    textColor
                            }
                        ]}
                    >
                        {
                            totalHabitos
                        }
                    </Text>

                </View>

                <View
                    style={
                        styles.summaryRow
                    }
                >

                    <Text
                        style={[
                            styles.summaryLabel,
                            {
                                color:
                                    secondaryText
                            }
                        ]}
                    >
                        Nivel de constancia
                    </Text>

                    <Text
                        style={[
                            styles.summaryValue,
                            {
                                color:
                                    textColor
                            }
                        ]}
                    >
                        {
                            progreso >= 70
                                ? "Alto"
                                : progreso >= 40
                                    ? "Medio"
                                    : "Bajo"
                        }
                    </Text>

                </View>

            </View>

            <View
                style={[
                    styles.achievementCard,
                    {
                        backgroundColor:
                            achievementBackground
                    }
                ]}
            >

                <Text
                    style={
                        styles.sectionTitleDark
                    }
                >
                    Logros
                </Text>

                <Text
                    style={
                        styles.achievement
                    }
                >
                    🏆 Primer hábito completado
                </Text>

                <Text
                    style={
                        styles.achievement
                    }
                >
                    🔥 Manteniendo disciplina
                </Text>

                <Text
                    style={
                        styles.achievement
                    }
                >
                    ⚡ Crecimiento constante
                </Text>

            </View>

        </ScrollView>
    );
};

const styles = {

    container: {
        flex: 1,
        paddingHorizontal: 22,
        paddingTop: 20
    },

    header: {
        marginBottom: 28
    },

    title: {
        fontSize: 34,
        fontWeight: "800"
    },

    subtitle: {
        marginTop: 6,
        fontSize: 16
    },

    heroCard: {
        backgroundColor:
            colors.primary,
        borderRadius: 30,
        padding: 28,
        marginBottom: 22,

        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems: "center",

        shadowColor:
            colors.primary,

        shadowOffset: {
            width: 0,
            height: 8
        },

        shadowOpacity: 0.22,

        shadowRadius: 12,

        elevation: 8
    },

    heroLabel: {
        color:
            "rgba(255,255,255,0.8)",
        fontSize: 15,
        marginBottom: 10
    },

    heroNumber: {
        color: "#fff",
        fontSize: 38,
        fontWeight: "800"
    },

    heroEmoji: {
        fontSize: 52
    },

    progressCard: {
        borderRadius: 28,
        padding: 24,
        marginBottom: 22,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 4
        },

        shadowOpacity: 0.06,

        shadowRadius: 8,

        elevation: 3
    },

    progressTop: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        marginBottom: 18
    },

    progressTitle: {
        fontSize: 18,
        fontWeight: "700"
    },

    progressPercent: {
        fontSize: 18,
        fontWeight: "800",
        color:
            colors.primary
    },

    progressBackground: {
        width: "100%",
        height: 18,
        backgroundColor:
            "#E5E7EB",
        borderRadius: 999,
        overflow: "hidden"
    },

    progressFill: {
        height: "100%",
        backgroundColor:
            colors.success,
        borderRadius: 999
    },

    progressMessage: {
        marginTop: 16,
        fontSize: 15,
        lineHeight: 24
    },

    row: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        marginBottom: 22
    },

    smallCard: {
        width: "48%",
        borderRadius: 26,
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

    cardEmoji: {
        fontSize: 28,
        marginBottom: 12
    },

    cardNumber: {
        fontSize: 30,
        fontWeight: "800",
        color:
            colors.primary,
        marginBottom: 8
    },

    cardLabel: {
        fontWeight: "600"
    },

    card: {
        borderRadius: 28,
        padding: 24,
        marginBottom: 22,

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 4
        },

        shadowOpacity: 0.06,

        shadowRadius: 8,

        elevation: 3
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 20
    },

    summaryRow: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        marginBottom: 18
    },

    summaryLabel: {
        fontSize: 15
    },

    summaryValue: {
        fontWeight: "700",
        fontSize: 15
    },

    achievementCard: {
        borderRadius: 28,
        padding: 24,
        marginBottom: 40
    },

    sectionTitleDark: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 18
    },

    achievement: {
        color:
            "rgba(255,255,255,0.85)",
        fontSize: 16,
        marginBottom: 16,
        lineHeight: 24
    }
};

export default StatsScreen;