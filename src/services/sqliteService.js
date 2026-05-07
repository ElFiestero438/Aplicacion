import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('habitos.db');

let listeners = [];

const notifyChanges = () => {
    const data = obtenerHabitos();
    listeners.forEach(cb => cb(data));
};

const subscribe = (callback) => {
    listeners.push(callback);
    callback(obtenerHabitos());

    return () => {
        listeners = listeners.filter(l => l !== callback);
    };
};

const init = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS habitos_local (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            hora TEXT,
            completado INTEGER
        );
    `);
};

const insertarHabito = (titulo, hora) => {
    db.runSync(
        `INSERT INTO habitos_local (titulo, hora, completado) VALUES (?, ?, ?)`,
        [titulo, hora, 0]
    );
    notifyChanges();
};

const obtenerHabitos = () => {
    return db.getAllSync(`SELECT * FROM habitos_local`);
};

const toggleHabitoLocal = (id, estadoActual) => {
    db.runSync(
        `UPDATE habitos_local SET completado = ? WHERE id = ?`,
        [estadoActual ? 0 : 1, id]
    );
    notifyChanges();
};

const eliminarHabitoLocal = (id) => {
    db.runSync(`DELETE FROM habitos_local WHERE id = ?`, [id]);
    notifyChanges();
};

const actualizarHoraLocal = (id, hora) => {
    db.runSync(
        `UPDATE habitos_local SET hora = ? WHERE id = ?`,
        [hora, id]
    );
    notifyChanges();
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