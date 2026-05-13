import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from "react-native";

import {
    useState
} from "react";

import {
    Ionicons
} from "@expo/vector-icons";

import colors from "../../constants/colors";

const GoalsScreen = ({ navigation, route }) => {

    const {
        sleepTime,
        wakeUpTime
    } = route.params;

    const [goalSeleccionado, setGoalSeleccionado] =
        useState(null);

    const goals = [

        {
            id: "1",
            emoji: "💪",
            title: "Salud"
        },

        {
            id: "2",
            emoji: "📚",
            title: "Estudio"
        },

        {
            id: "3",
            emoji: "🧠",
            title: "Disciplina"
        },

        {
            id: "4",
            emoji: "😴",
            title: "Dormir mejor"
        },

        {
            id: "5",
            emoji: "💼",
            title: "Productividad"
        },

        {
            id: "6",
            emoji: "✨",
            title: "Bienestar"
        }
    ];

    const continuar = () => {

        if (!goalSeleccionado) return;

        navigation.navigate(
            "Finish",
            {
                sleepTime,
                wakeUpTime,
                goal: goalSeleccionado
            }
        );
    };

    const renderItem = ({ item }) => {

        const seleccionado =
            goalSeleccionado === item.title;

        return (

            <TouchableOpacity
                activeOpacity={0.85}
                style={[
                    styles.card,

                    seleccionado && {
                        borderColor:
                            colors.primary,

                        backgroundColor:
                            "#E8F0FF"
                    }
                ]}
                onPress={() =>
                    setGoalSeleccionado(
                        item.title
                    )
                }
            >

                <Text style={styles.emoji}>
                    {item.emoji}
                </Text>

                <Text style={styles.cardTitle}>
                    {item.title}
                </Text>

                {seleccionado && (

                    <View style={styles.checkContainer}>

                        <Ionicons
                            name="checkmark"
                            size={16}
                            color="#fff"
                        />

                    </View>
                )}

            </TouchableOpacity>
        );
    };

    return (

        <View style={styles.container}>

            <View>

                <View style={styles.iconContainer}>

                    <Ionicons
                        name="flag-outline"
                        size={40}
                        color={colors.primary}
                    />

                </View>

                <Text style={styles.step}>
                    Paso 3 de 3
                </Text>

                <Text style={styles.title}>
                    ¿Cuál es tu meta principal?
                </Text>

                <Text style={styles.description}>
                    Personalizaremos tu experiencia
                    según aquello que deseas mejorar
                    en tu vida diaria.
                </Text>

            </View>

            <FlatList
                data={goals}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: "space-between"
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: 10
                }}
            />

            <TouchableOpacity
                activeOpacity={0.85}
                style={[
                    styles.nextButton,

                    !goalSeleccionado && {
                        opacity: 0.5
                    }
                ]}
                disabled={!goalSeleccionado}
                onPress={continuar}
            >

                <Text style={styles.nextButtonText}>
                    Finalizar
                </Text>

                <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#fff"
                />

            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 24,
        paddingVertical: 60,
        justifyContent: "space-between"
    },

    iconContainer: {
        width: 82,
        height: 82,
        borderRadius: 24,
        backgroundColor: "#E8F0FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 28
    },

    step: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 18
    },

    title: {
        fontSize: 36,
        fontWeight: "800",
        color: colors.textPrimary,
        lineHeight: 46,
        marginBottom: 18
    },

    description: {
        fontSize: 17,
        color: colors.textSecondary,
        lineHeight: 28,
        marginBottom: 20
    },

    card: {
        width: "48%",
        backgroundColor: colors.surface,
        borderRadius: 24,
        paddingVertical: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,

        borderWidth: 2,
        borderColor: "transparent",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,

        elevation: 3
    },

    emoji: {
        fontSize: 36,
        marginBottom: 14
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.textPrimary
    },

    checkContainer: {
        position: "absolute",
        top: 12,
        right: 12,

        width: 24,
        height: 24,
        borderRadius: 12,

        backgroundColor: colors.primary,

        justifyContent: "center",
        alignItems: "center"
    },

    nextButton: {
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },

    nextButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
        marginRight: 8
    }
});

export default GoalsScreen;