import * as SQLite from "expo-sqlite";

const db =
    SQLite.openDatabaseSync(
        "habitos.db"
    );

let listeners = [];

const notifyChanges = () => {

    const data =
        obtenerHabitos();

    listeners.forEach(
        (callback) =>
            callback(data)
    );
};

const subscribe = (callback) => {

    listeners.push(callback);

    callback(
        obtenerHabitos()
    );

    return () => {

        listeners =
            listeners.filter(
                (listener) =>
                    listener !== callback
            );
    };
};

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

const resetHabitosDiarios =
    () => {

        try {

            const hoy =
                obtenerFechaHoy();

            db.runSync(

                `

                UPDATE habitos_local

                SET completadoHoy = 0

                WHERE ultimaFechaCompletado IS NOT NULL
                AND ultimaFechaCompletado != ?

                `,

                [hoy]
            );

        } catch (error) {

            console.log(
                "Error reseteando hábitos:",
                error
            );
        }
    };

const init = () => {

    try {

        db.execSync(`

            CREATE TABLE IF NOT EXISTS habitos_local (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                titulo TEXT NOT NULL,

                hora TEXT,

                completadoHoy INTEGER DEFAULT 0,

                permanente INTEGER DEFAULT 1,

                createdAt INTEGER,

                ultimaFechaCompletado TEXT
            );

        `);

        const columnas =
            db.getAllSync(
                `PRAGMA table_info(habitos_local);`
            );

        const existeCreatedAt =
            columnas.some(
                col =>
                    col.name ===
                    "createdAt"
            );

        const existeUltimaFecha =
            columnas.some(
                col =>
                    col.name ===
                    "ultimaFechaCompletado"
            );

        if (
            !existeCreatedAt
        ) {

            db.execSync(`

                ALTER TABLE habitos_local

                ADD COLUMN createdAt INTEGER;

            `);

            db.runSync(

                `

                UPDATE habitos_local

                SET createdAt = ?

                WHERE createdAt IS NULL

                `,

                [Date.now()]
            );
        }

        if (
            !existeUltimaFecha
        ) {

            db.execSync(`

                ALTER TABLE habitos_local

                ADD COLUMN ultimaFechaCompletado TEXT;

            `);
        }

        resetHabitosDiarios();

    } catch (error) {

        console.log(
            "Error inicializando SQLite:",
            error
        );
    }
};

const insertarHabito = (
    titulo,
    hora
) => {

    try {

        db.runSync(

            `

            INSERT INTO habitos_local (

                titulo,

                hora,

                completadoHoy,

                permanente,

                createdAt,

                ultimaFechaCompletado

            )

            VALUES (?, ?, ?, ?, ?, ?)

            `,

            [
                titulo,
                hora,
                0,
                1,
                Date.now(),
                null
            ]
        );

        notifyChanges();

    } catch (error) {

        console.log(
            "Error insertando hábito:",
            error
        );
    }
};

const obtenerHabitos = () => {

    try {

        resetHabitosDiarios();

        return db.getAllSync(`

            SELECT *

            FROM habitos_local

            ORDER BY createdAt DESC

        `);

    } catch (error) {

        console.log(
            "Error obteniendo hábitos:",
            error
        );

        return [];
    }
};

const toggleHabitoLocal = (
    id,
    estadoActual = false
) => {

    try {

        const hoy =
            obtenerFechaHoy();

        if (estadoActual) {

            db.runSync(

                `

                UPDATE habitos_local

                SET completadoHoy = 0,
                    ultimaFechaCompletado = NULL

                WHERE id = ?

                `,

                [id]
            );

        } else {

            db.runSync(

                `

                UPDATE habitos_local

                SET completadoHoy = 1,
                    ultimaFechaCompletado = ?

                WHERE id = ?

                `,

                [
                    hoy,
                    id
                ]
            );
        }

        notifyChanges();

    } catch (error) {

        console.log(
            "Error actualizando hábito:",
            error
        );
    }
};

const eliminarHabitoLocal = (
    id
) => {

    try {

        db.runSync(

            `

            DELETE FROM habitos_local

            WHERE id = ?

            `,

            [id]
        );

        notifyChanges();

    } catch (error) {

        console.log(
            "Error eliminando hábito:",
            error
        );
    }
};

const actualizarHoraLocal = (
    id,
    hora
) => {

    try {

        db.runSync(

            `

            UPDATE habitos_local

            SET hora = ?

            WHERE id = ?

            `,

            [
                hora,
                id
            ]
        );

        notifyChanges();

    } catch (error) {

        console.log(
            "Error actualizando hora:",
            error
        );
    }
};

export default {

    init,

    insertarHabito,

    obtenerHabitos,

    toggleHabitoLocal,

    eliminarHabitoLocal,

    actualizarHoraLocal,

    subscribe
};