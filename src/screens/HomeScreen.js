import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput
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

    const [habitos, setHabitos] = useState([]);
    const [user, setUser] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);

    const [nuevoHabito, setNuevoHabito] = useState("");
    const [habitoSeleccionado, setHabitoSeleccionado] = useState(null);

    const [hora, setHora] = useState(new Date());

    const [showPickerCrear, setShowPickerCrear] = useState(false);
    const [showPickerModal, setShowPickerModal] = useState(false);

    const habitosBase = [
        { titulo: "Despertar temprano", hora: "06:00" },
        { titulo: "Hacer ejercicio", hora: "07:00" },
        { titulo: "Leer 20 minutos", hora: "21:00" },
        { titulo: "Beber agua", hora: "09:00" },
        { titulo: "Planear el día", hora: "08:00" }
    ];

    const cerrarModalAcciones = () => {

        setShowPickerModal(false);

        setHabitoSeleccionado(null);

        setModalAcciones(false);
    };

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

        let unsubscribeHabitos = () => {};
        let unsubscribeLocal = () => {};

        const unsubscribeAuth = onAuthStateChanged(
            auth,
            async (currentUser) => {

                setUser(currentUser);

                if (!currentUser) {

                    unsubscribeLocal =
                        sqliteService.subscribe((data) => {

                            setHabitos(data || []);
                        });

                    return;
                }

                await inicializarHabitos(currentUser);

                unsubscribeHabitos =
                    escucharHabitos(
                        currentUser,
                        (data) => {

                            setHabitos(data || []);
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

    const agregarHabito = async () => {

        if (!nuevoHabito.trim()) return;

        const horaFormateada = formatHora(hora);

        try {

            if (user) {

                await crearHabito(
                    user,
                    nuevoHabito,
                    horaFormateada
                );

            } else {

                sqliteService.insertarHabito(
                    nuevoHabito,
                    horaFormateada
                );
            }

            setNuevoHabito("");

            setHora(new Date());

            setShowPickerCrear(false);

            setModalVisible(false);

        } catch (error) {

            console.log(error);
        }
    };

    const accionesHabito = (item) => {

        setHabitoSeleccionado(item);

        if (item?.hora) {

            const [h, m] = item.hora.split(":");

            const nuevaFecha = new Date();

            nuevaFecha.setHours(parseInt(h));
            nuevaFecha.setMinutes(parseInt(m));

            setHora(nuevaFecha);
        }

        setModalAcciones(true);
    };

    const completar = async () => {

        if (!habitoSeleccionado) return;

        try {

            if (user) {

                await toggleHabito(
                    habitoSeleccionado.id
                );

            } else {

                sqliteService.eliminarHabitoLocal(
                    habitoSeleccionado.id
                );
            }

            cerrarModalAcciones();

        } catch (error) {

            console.log(error);
        }
    };

    const eliminar = async () => {

        if (!habitoSeleccionado) return;

        try {

            if (user) {

                await eliminarHabito(
                    habitoSeleccionado.id
                );

            } else {

                sqliteService.eliminarHabitoLocal(
                    habitoSeleccionado.id
                );
            }

            cerrarModalAcciones();

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

        setShowPickerCrear(false);
        setShowPickerModal(false);
    };

    const confirmarCambioHora = async () => {

        if (!habitoSeleccionado) return;

        const nuevaHora = formatHora(hora);

        try {

            if (user) {

                await actualizarHoraHabito(
                    habitoSeleccionado.id,
                    nuevaHora
                );

            } else {

                sqliteService.actualizarHoraLocal(
                    habitoSeleccionado.id,
                    nuevaHora
                );
            }

            cerrarModalAcciones();

        } catch (error) {

            console.log(error);
        }
    };

    const renderPredefinidos = () => {

        return (

            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10
                }}
            >

                {habitosBase.map((base, index) => {

                    const existente = habitos.find(
                        h => h.titulo === base.titulo
                    );

                    return (

                        <TouchableOpacity
                            key={index}
                            style={{
                                width: "48%",
                                padding: 15,
                                borderRadius: 12,
                                backgroundColor: existente?.completado
                                    ? colors.success
                                    : colors.surface,
                                borderWidth: 1,
                                borderColor: colors.border
                            }}
                            onPress={async () => {

                                if (existente) {

                                    accionesHabito(existente);

                                } else {

                                    if (user) {

                                        await crearHabito(
                                            user,
                                            base.titulo,
                                            base.hora
                                        );

                                    } else {

                                        sqliteService.insertarHabito(
                                            base.titulo,
                                            base.hora
                                        );
                                    }
                                }
                            }}
                        >

                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: colors.textPrimary
                                }}
                            >
                                {base.titulo}
                            </Text>

                            <Text
                                style={{
                                    color: colors.textSecondary
                                }}
                            >
                                {base.hora}
                            </Text>

                        </TouchableOpacity>
                    );
                })}

            </View>
        );
    };

    const renderItem = ({ item }) => {

        return (

            <TouchableOpacity
                style={{
                    padding: 15,
                    marginVertical: 6,
                    backgroundColor:
                        item?.completado
                            ? colors.success
                            : colors.surface,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border
                }}
                onPress={() => accionesHabito(item)}
            >

                <Text
                    style={{
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        textDecorationLine:
                            item?.completado
                                ? "line-through"
                                : "none"
                    }}
                >
                    {item.titulo}
                </Text>

                <Text
                    style={{
                        color: colors.textSecondary
                    }}
                >
                    Hora: {item.hora}
                </Text>

            </TouchableOpacity>
        );
    };

    return (

        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: colors.background
            }}
        >

            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 10
                }}
            >
                Hábitos recomendados
            </Text>

            {renderPredefinidos()}

            <TouchableOpacity
                style={{
                    marginTop: 20,
                    backgroundColor: colors.primary,
                    padding: 15,
                    borderRadius: 12,
                    alignItems: "center"
                }}
                onPress={() => setModalVisible(true)}
            >

                <Text
                    style={{
                        color: "#fff",
                        fontWeight: "bold"
                    }}
                >
                    + Agregar hábito
                </Text>

            </TouchableOpacity>

            <FlatList
                data={habitos}
                keyExtractor={(item, index) =>
                    item?.id
                        ? item.id.toString()
                        : index.toString()
                }
                renderItem={renderItem}
                style={{ marginTop: 15 }}
            />

            {/* MODAL CREAR */}

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
            >

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <View
                        style={{
                            backgroundColor: "#fff",
                            margin: 20,
                            borderRadius: 12,
                            padding: 20
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginBottom: 10
                            }}
                        >
                            Nuevo hábito
                        </Text>

                        <TextInput
                            placeholder="Nombre del hábito"
                            value={nuevoHabito}
                            onChangeText={setNuevoHabito}
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                padding: 10,
                                borderRadius: 8,
                                marginBottom: 10
                            }}
                        />

                        <TouchableOpacity
                            style={{
                                padding: 12,
                                backgroundColor: "#eee",
                                borderRadius: 8
                            }}
                            onPress={() =>
                                setShowPickerCrear(true)
                            }
                        >

                            <Text>
                                {formatHora(hora)}
                            </Text>

                        </TouchableOpacity>

                        {showPickerCrear && (

                            <DateTimePicker
                                value={hora}
                                mode="time"
                                display="default"
                                onChange={onChangeHora}
                            />
                        )}

                        <TouchableOpacity
                            style={{
                                marginTop: 15,
                                backgroundColor: colors.primary,
                                padding: 12,
                                borderRadius: 10,
                                alignItems: "center"
                            }}
                            onPress={agregarHabito}
                        >

                            <Text
                                style={{
                                    color: "#fff"
                                }}
                            >
                                Guardar
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginTop: 10,
                                alignItems: "center"
                            }}
                            onPress={() =>
                                setModalVisible(false)
                            }
                        >

                            <Text>
                                Cancelar
                            </Text>

                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            {/* MODAL ACCIONES */}

            <Modal
                visible={modalAcciones}
                transparent
                animationType="fade"
                onRequestClose={cerrarModalAcciones}
            >

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.4)"
                    }}
                >

                    <View
                        style={{
                            width: "85%",
                            backgroundColor: "#fff",
                            borderRadius: 16,
                            padding: 20
                        }}
                    >

                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginBottom: 10,
                                textAlign: "center"
                            }}
                        >
                            {habitoSeleccionado?.titulo}
                        </Text>

                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={completar}
                        >

                            <Text
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                Completar
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() =>
                                setShowPickerModal(true)
                            }
                        >

                            <Text
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                Cambiar hora
                            </Text>

                        </TouchableOpacity>

                        {showPickerModal && (

                            <DateTimePicker
                                value={hora}
                                mode="time"
                                display="default"
                                onChange={onChangeHora}
                            />
                        )}

                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={confirmarCambioHora}
                        >

                            <Text
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                Guardar hora
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={eliminar}
                        >

                            <Text
                                style={{
                                    textAlign: "center",
                                    color: "red"
                                }}
                            >
                                Eliminar
                            </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ marginTop: 10 }}
                            onPress={cerrarModalAcciones}
                        >

                            <Text
                                style={{
                                    textAlign: "center"
                                }}
                            >
                                Cerrar
                            </Text>

                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default HomeScreen;