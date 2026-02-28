import colors from "../../constants/colors";
import { View, Text } from "react-native";

const LoginScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
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

export default LoginScreen;
