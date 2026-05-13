import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import {
    useState
} from "react";

import {
    Ionicons
} from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import colors from "../../constants/colors";

const WakeUpScreen = ({ navigation, route }) => {

    const { sleepTime } = route.params;

    const [horaDespertar, setHoraDespertar] =
        useState(new Date());

    const [showPicker, setShowPicker] =
        useState(false);

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

    const onChangeHora = (
        event,
        selectedDate
    ) => {

        if (selectedDate) {

            setHoraDespertar(selectedDate);
        }

        setShowPicker(false);
    };

    return (

        <View style={styles.container}>

            <View>

                <View style={styles.iconContainer}>

                    <Ionicons
                        name="sunny-outline"
                        size={40}
                        color={colors.primary}
                    />

                </View>

                <Text style={styles.step}>
                    Paso 2 de 3
                </Text>

                <Text style={styles.title}>
                    ¿A qué hora sueles despertar?
                </Text>

                <Text style={styles.description}>
                    Esto nos ayudará a organizar
                    hábitos alineados con tu rutina
                    diaria y tu energía.
                </Text>

            </View>

            <View>

                <View style={styles.card}>

                    <Text style={styles.cardLabel}>
                        Hora aproximada
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.timeButton}
                        onPress={() =>
                            setShowPicker(true)
                        }
                    >

                        <Ionicons
                            name="time-outline"
                            size={24}
                            color={colors.primary}
                        />

                        <Text style={styles.timeText}>
                            {formatHora(horaDespertar)}
                        </Text>

                    </TouchableOpacity>

                    {showPicker && (

                        <DateTimePicker
                            value={horaDespertar}
                            mode="time"
                            display="default"
                            onChange={onChangeHora}
                        />
                    )}

                </View>

            </View>

            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.nextButton}
                onPress={() =>
                    navigation.navigate(
                        "Goals",
                        {
                            sleepTime,
                            wakeUpTime:
                                formatHora(
                                    horaDespertar
                                )
                        }
                    )
                }
            >

                <Text style={styles.nextButtonText}>
                    Continuar
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
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 60
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
        lineHeight: 28
    },

    card: {
        backgroundColor: colors.surface,
        borderRadius: 26,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,

        elevation: 3
    },

    cardLabel: {
        fontSize: 15,
        color: colors.textSecondary,
        marginBottom: 18,
        fontWeight: "600"
    },

    timeButton: {
        backgroundColor: "#F8FAFC",
        borderRadius: 20,
        paddingVertical: 22,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },

    timeText: {
        marginLeft: 10,
        fontSize: 30,
        fontWeight: "700",
        color: colors.textPrimary
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

export default WakeUpScreen;