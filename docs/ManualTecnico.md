# MANUAL TÉCNICO – BETTER HABITS

## 1. Introducción

Better Habits es una aplicación móvil hecha con React Native y Expo. La idea principal de la app es ayudar a las personas a crear y seguir hábitos saludables de una forma sencilla.

La aplicación usa Firebase para el manejo de usuarios, SQLite para guardar datos localmente y Cloudinary para las imágenes de perfil.

---

## 2. Objetivo del proyecto

El objetivo del proyecto es crear una aplicación funcional donde los usuarios puedan organizar sus hábitos diarios y llevar seguimiento de ellos.

---

## 3. Tecnologías usadas

| Tecnología       | Uso                         |
| ---------------- | --------------------------- |
| React Native     | Desarrollo de la app        |
| Expo             | Ejecución y pruebas         |
| Firebase         | Registro e inicio de sesión |
| SQLite           | Guardar datos localmente    |
| Cloudinary       | Guardar imágenes            |
| React Navigation | Navegación entre pantallas  |

---

## 4. Organización del proyecto

El proyecto está dividido en varias carpetas según su función.

```text id="g3g78d"
src/
 ├── screens/
 ├── services/
 ├── components/
 ├── constants/
```

### Explicación rápida

* screens: pantallas de la aplicación.
* services: lógica, Firebase y SQLite.
* components: componentes reutilizables.
* constants: colores y configuraciones.

---

## 5. Funcionalidades principales

### Usuarios

* Registro
* Inicio de sesión
* Persistencia de sesión

### Hábitos

* Crear hábitos
* Marcar hábitos completados
* Guardar progreso

### Perfil

* Cambiar nombre
* Cambiar foto de perfil

### Persistencia

* Uso de SQLite para guardar información localmente.

---

## 6. Base de datos

La aplicación usa SQLite para almacenar hábitos en el dispositivo.

Ejemplo de tabla:

```sql id="xvjlwm"
CREATE TABLE habitos (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 titulo TEXT,
 completado INTEGER
);
```

---

## 7. Instalación y ejecución

### Instalar dependencias

```bash id="5m1c7p"
npm install
```

### Ejecutar el proyecto

```bash id="wq6ibz"
npx expo start
```

---

## 8. Conclusión

Better Habits cumple con las características básicas de un Producto Mínimo Viable, incluyendo autenticación, almacenamiento local y manejo de perfiles de usuario.
