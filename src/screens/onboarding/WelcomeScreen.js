import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import {
    Ionicons
} from "@expo/vector-icons";

import colors from "../../constants/colors";

const WelcomeScreen = ({ navigation }) => {

    return (

        <View style={styles.container}>

            <View style={styles.topSection}>

                <View style={styles.iconContainer}>

                    <Ionicons
                        name="sparkles"
                        size={42}
                        color={colors.primary}
                    />

                </View>

                <Text style={styles.logo}>
                    Better Habits
                </Text>

                <Text style={styles.title}>
                    Construye una mejor versión de ti
                </Text>

                <Text style={styles.description}>
                    Personalicemos tu experiencia
                    para ayudarte a crear hábitos
                    saludables y sostenibles.
                </Text>

            </View>

            <View style={styles.bottomSection}>

                <View style={styles.card}>

                    <View style={styles.featureRow}>

                        <Ionicons
                            name="moon-outline"
                            size={22}
                            color={colors.primary}
                        />

                        <Text style={styles.featureText}>
                            Rutinas de sueño
                        </Text>

                    </View>

                    <View style={styles.featureRow}>

                        <Ionicons
                            name="barbell-outline"
                            size={22}
                            color={colors.primary}
                        />

                        <Text style={styles.featureText}>
                            Hábitos saludables
                        </Text>

                    </View>

                    <View style={styles.featureRow}>

                        <Ionicons
                            name="trending-up-outline"
                            size={22}
                            color={colors.primary}
                        />

                        <Text style={styles.featureText}>
                            Metas personales
                        </Text>

                    </View>

                </View>

                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.button}
                    onPress={() =>
                        navigation.navigate("Sleep")
                    }
                >

                    <Text style={styles.buttonText}>
                        Comenzar
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={20}
                        color="#fff"
                    />

                </TouchableOpacity>

            </View>

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

    topSection: {
        marginTop: 40
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

    logo: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 14
    },

    title: {
        fontSize: 38,
        fontWeight: "800",
        color: colors.textPrimary,
        lineHeight: 48,
        marginBottom: 18
    },

    description: {
        fontSize: 17,
        lineHeight: 28,
        color: colors.textSecondary
    },

    bottomSection: {
        marginBottom: 10
    },

    card: {
        backgroundColor: colors.surface,
        borderRadius: 26,
        padding: 24,
        marginBottom: 24,
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

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18
    },

    featureText: {
        marginLeft: 14,
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: "600"
    },

    button: {
        backgroundColor: colors.primary,
        borderRadius: 18,
        paddingVertical: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    buttonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
        marginRight: 8
    }
});

export default WelcomeScreen;