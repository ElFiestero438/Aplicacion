import colors from "../constants/colors";
import { View, Text } from "react-native";

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.principal,
    }
};

export default SettingsScreen;
