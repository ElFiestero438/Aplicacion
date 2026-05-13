import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../constants/colors";

const FinishScreen = ({
    navigation,
    route
}) => {

    const {
        sleepTime,
        wakeUpTime,
        goal
    } = route.params;

    const finalizarOnboarding =
        async () => {

            try {

                await AsyncStorage.setItem(
                    "onboardingComplete",
                    "true"
                );

                await AsyncStorage.setItem(
                    "userGoal",
                    goal
                );

                await AsyncStorage.setItem(
                    "sleepTime",
                    sleepTime
                );

                await AsyncStorage.setItem(
                    "wakeUpTime",
                    wakeUpTime
                );

                navigation.replace(
                    "Login"
                );

            } catch (error) {

                console.log(error);
            }
        };

    return (

        <View style={styles.container}>

            <View style={styles.content}>

                <View style={styles.iconContainer}>

                    <Text style={styles.emoji}>
                        🚀
                    </Text>

                </View>

                <Text style={styles.title}>
                    Todo listo
                </Text>

                <Text style={styles.description}>
                    Better Habits fue personalizado
                    según tu rutina y objetivos.
                    Ahora puedes empezar a construir
                    hábitos más saludables.
                </Text>

                <View style={styles.summary}>

                    <View style={styles.summaryItem}>

                        <Text style={styles.summaryLabel}>
                            Hora de dormir
                        </Text>

                        <Text style={styles.summaryValue}>
                            🌙 {sleepTime}
                        </Text>

                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryItem}>

                        <Text style={styles.summaryLabel}>
                            Hora de despertar
                        </Text>

                        <Text style={styles.summaryValue}>
                            ☀️ {wakeUpTime}
                        </Text>

                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryItem}>

                        <Text style={styles.summaryLabel}>
                            Meta principal
                        </Text>

                        <Text style={styles.summaryValue}>
                            🎯 {goal}
                        </Text>

                    </View>

                </View>

            </View>

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.button}
                onPress={finalizarOnboarding}
            >

                <Text style={styles.buttonText}>
                    Entrar a Better Habits
                </Text>

            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "space-between",
        paddingHorizontal: 25,
        paddingVertical: 70
    },

    content: {
        alignItems: "center",
        marginTop: 40
    },

    iconContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#DBEAFE",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30
    },

    emoji: {
        fontSize: 52
    },

    title: {
        fontSize: 36,
        fontWeight: "800",
        color: colors.textPrimary,
        marginBottom: 18
    },

    description: {
        fontSize: 16,
        lineHeight: 28,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: 35
    },

    summary: {
        width: "100%",
        backgroundColor: colors.surface,
        borderRadius: 28,
        padding: 24,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.06,
        shadowRadius: 8,

        elevation: 4
    },

    summaryItem: {
        paddingVertical: 6
    },

    summaryLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8
    },

    summaryValue: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary
    },

    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: 16
    },

    button: {
        backgroundColor: colors.primary,
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.12,
        shadowRadius: 8,

        elevation: 5
    },

    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700"
    }
});

export default FinishScreen;