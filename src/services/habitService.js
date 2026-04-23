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
  getDocs
} from "firebase/firestore";

const HABITOS_PREDEFINIDOS = [
  { titulo: "Desayunar saludable", hora: "07:00" },
  { titulo: "Estudiar", hora: "18:00" },
  { titulo: "Leer", hora: "20:00" },
  { titulo: "Hacer ejercicio", hora: "06:00" }
];

export const inicializarHabitos = async (user) => {
  if (!user) return;

  const q = query(
    collection(db, "habitos"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) return;

  for (let habito of HABITOS_PREDEFINIDOS) {
    await addDoc(collection(db, "habitos"), {
      ...habito,
      userId: user.uid,
      completadoHoy: false,
      fecha: new Date().toDateString()
    });
  }
};

export const escucharHabitos = (user, callback) => {
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "habitos"),
    where("userId", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });

  return unsubscribe;
};

export const toggleHabito = async (id, estado) => {
  if (!id) return;

  const ref = doc(db, "habitos", id);

  await updateDoc(ref, {
    completadoHoy: !estado
  });
};

export const actualizarHoraHabito = async (id, nuevaHora) => {
  if (!id) return;

  const ref = doc(db, "habitos", id);

  await updateDoc(ref, {
    hora: nuevaHora
  });
};

export const eliminarHabito = async (id) => {
  if (!id) return;

  const ref = doc(db, "habitos", id);
  await deleteDoc(ref);
};

export const crearHabito = async (user, titulo, hora) => {
  if (!user || !titulo) return;

  await addDoc(collection(db, "habitos"), {
    titulo,
    hora: hora || "00:00",
    userId: user.uid,
    completadoHoy: false,
    fecha: new Date().toDateString()
  });
};