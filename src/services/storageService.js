import AsyncStorage from "@react-native-async-storage/async-storage";

const storageService = {

    guardarHoraDormir: async (hora) => {

        try {

            await AsyncStorage.setItem(
                "horaDormir",
                hora
            );

        } catch (error) {

            console.log(
                "Error guardando hora dormir:",
                error
            );
        }
    },

    obtenerHoraDormir: async () => {

        try {

            return await AsyncStorage.getItem(
                "horaDormir"
            );

        } catch (error) {

            console.log(
                "Error obteniendo hora dormir:",
                error
            );

            return null;
        }
    },

    guardarHoraDespertar: async (hora) => {

        try {

            await AsyncStorage.setItem(
                "horaDespertar",
                hora
            );

        } catch (error) {

            console.log(
                "Error guardando hora despertar:",
                error
            );
        }
    },

    obtenerHoraDespertar: async () => {

        try {

            return await AsyncStorage.getItem(
                "horaDespertar"
            );

        } catch (error) {

            console.log(
                "Error obteniendo hora despertar:",
                error
            );

            return null;
        }
    },

    guardarMeta: async (meta) => {

        try {

            await AsyncStorage.setItem(
                "metaUsuario",
                meta
            );

        } catch (error) {

            console.log(
                "Error guardando meta:",
                error
            );
        }
    },

    obtenerMeta: async () => {

        try {

            return await AsyncStorage.getItem(
                "metaUsuario"
            );

        } catch (error) {

            console.log(
                "Error obteniendo meta:",
                error
            );

            return null;
        }
    },

    guardarOnboardingCompletado: async () => {

        try {

            await AsyncStorage.setItem(
                "onboardingCompletado",
                "true"
            );

        } catch (error) {

            console.log(
                "Error guardando onboarding:",
                error
            );
        }
    },

    obtenerOnboardingCompletado: async () => {

        try {

            const valor =
                await AsyncStorage.getItem(
                    "onboardingCompletado"
                );

            return valor === "true";

        } catch (error) {

            console.log(
                "Error obteniendo onboarding:",
                error
            );

            return false;
        }
    }
};

export default storageService;