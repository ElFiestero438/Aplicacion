import { db } from "./firebaseService";

import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    orderBy,
    serverTimestamp
} from "firebase/firestore";

const HABITOS_PREDEFINIDOS = [

    {
        titulo: "Desayunar saludable",
        hora: "07:00",
        permanente: true
    },

    {
        titulo: "Estudiar",
        hora: "18:00",
        permanente: true
    },

    {
        titulo: "Leer",
        hora: "20:00",
        permanente: true
    },

    {
        titulo: "Hacer ejercicio",
        hora: "06:00",
        permanente: true
    }
];

const obtenerFechaHoy = () => {

    const hoy =
        new Date();

    const year =
        hoy.getFullYear();

    const month =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            hoy.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const inicializarHabitos = async (user) => {

    if (!user) return;

    try {

        const q = query(
            collection(db, "habitos"),
            where(
                "userId",
                "==",
                user.uid
            )
        );

        const snapshot =
            await getDocs(q);

        if (!snapshot.empty)
            return;

        for (const habito of HABITOS_PREDEFINIDOS) {

            await addDoc(
                collection(
                    db,
                    "habitos"
                ),
                {

                    titulo:
                        habito.titulo,

                    hora:
                        habito.hora,

                    permanente:
                        habito.permanente,

                    completadoHoy:
                        false,

                    ultimaFecha:
                        "",

                    userId:
                        user.uid,

                    createdAt:
                        serverTimestamp()
                }
            );
        }

    } catch (error) {

        console.log(
            "Error inicializando hábitos:",
            error
        );
    }
};

export const escucharHabitos = (
    user,
    callback
) => {

    if (!user) {

        callback([]);

        return () => {};
    }

    try {

        const q = query(
            collection(db, "habitos"),
            where(
                "userId",
                "==",
                user.uid
            ),
            orderBy(
                "createdAt",
                "desc"
            )
        );

        const unsubscribe =
            onSnapshot(
                q,
                async (snapshot) => {

                    const hoy =
                        obtenerFechaHoy();

                    const data =
                        [];

                    for (const d of snapshot.docs) {

                        const habito = {

                            id: d.id,

                            ...d.data()
                        };

                        if (
                            habito.completadoHoy &&
                            habito.ultimaFecha &&
                            habito.ultimaFecha !==
                                hoy
                        ) {

                            try {

                                await updateDoc(
                                    doc(
                                        db,
                                        "habitos",
                                        habito.id
                                    ),
                                    {
                                        completadoHoy:
                                            false
                                    }
                                );

                                habito.completadoHoy =
                                    false;

                            } catch (
                                error
                            ) {

                                console.log(
                                    "Error reiniciando hábito:",
                                    error
                                );
                            }
                        }

                        data.push(
                            habito
                        );
                    }

                    callback(data);
                },

                (error) => {

                    console.log(
                        "Error escuchando hábitos:",
                        error
                    );

                    callback([]);
                }
            );

        return unsubscribe;

    } catch (error) {

        console.log(error);

        callback([]);

        return () => {};
    }
};

export const crearHabito = async (
    user,
    titulo,
    hora,
    permanente = true
) => {

    if (
        !user ||
        !titulo?.trim()
    )
        return;

    try {

        const nuevoHabito = {

            titulo:
                titulo.trim(),

            hora:
                hora || "00:00",

            userId:
                user.uid,

            completadoHoy:
                false,

            ultimaFecha:
                "",

            permanente,

            createdAt:
                serverTimestamp()
        };

        const docRef =
            await addDoc(
                collection(
                    db,
                    "habitos"
                ),
                nuevoHabito
            );

        return {
            id: docRef.id,
            ...nuevoHabito
        };

    } catch (error) {

        console.log(
            "Error creando hábito:",
            error
        );

        return null;
    }
};

export const toggleHabito = async (
    habitId,
    completadoActual
) => {

    try {

        const ref =
            doc(
                db,
                "habitos",
                habitId
            );

        const hoy =
            obtenerFechaHoy();

        if (
            completadoActual
        ) {

            await updateDoc(
                ref,
                {
                    completadoHoy:
                        false,

                    ultimaFecha: ""
                }
            );

        } else {

            await updateDoc(
                ref,
                {
                    completadoHoy:
                        true,

                    ultimaFecha:
                        hoy
                }
            );
        }

    } catch (error) {

        console.log(
            "Error cambiando estado:",
            error
        );
    }
};

export const actualizarHoraHabito = async (
    id,
    nuevaHora
) => {

    if (!id) return;

    try {

        const ref =
            doc(
                db,
                "habitos",
                id
            );

        await updateDoc(
            ref,
            {
                hora:
                    nuevaHora
            }
        );

    } catch (error) {

        console.log(
            "Error actualizando hora:",
            error
        );
    }
};

export const eliminarHabito = async (
    id
) => {

    if (!id) return;

    try {

        const ref =
            doc(
                db,
                "habitos",
                id
            );

        await deleteDoc(ref);

    } catch (error) {

        console.log(
            "Error eliminando hábito:",
            error
        );
    }
};