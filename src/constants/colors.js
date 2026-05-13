import AsyncStorage from "@react-native-async-storage/async-storage";

const darkMode = global?.darkModeEnabled;

export default {

  primary: "#2563EB",
  secondary: "#1E40AF",

  background:
    darkMode
      ? "#0F172A"
      : "#F5F7FB",

  surface:
    darkMode
      ? "#111827"
      : "#FFFFFF",

  surfaceSecondary:
    darkMode
      ? "#1E293B"
      : "#EEF2FF",

  textPrimary:
    darkMode
      ? "#F9FAFB"
      : "#111827",

  textSecondary:
    darkMode
      ? "#CBD5E1"
      : "#6B7280",

  textLight:
    darkMode
      ? "#94A3B8"
      : "#9CA3AF",

  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",

  border:
    darkMode
      ? "#334155"
      : "#E5E7EB",

  disabled:
    darkMode
      ? "#64748B"
      : "#9CA3AF",

  iluminado:
    darkMode
      ? "#1E293B"
      : "#FFFFFF",

  suave:
    darkMode
      ? "#94A3B8"
      : "#9CA3AF",

  alerta: "#EF4444",

  variante1:
    darkMode
      ? "#1E3A8A"
      : "#DBEAFE",

  variante2:
    darkMode
      ? "#1D4ED8"
      : "#BFDBFE",

  variante3:
    darkMode
      ? "#2563EB"
      : "#93C5FD",

  variante4:
    darkMode
      ? "#3B82F6"
      : "#3B82F6",

  variante5:
    darkMode
      ? "#60A5FA"
      : "#2563EB",

  shadow:
    darkMode
      ? "rgba(0,0,0,0.45)"
      : "rgba(0,0,0,0.08)",

  gradientePrimario:
    darkMode
      ? ["#1E3A8A", "#2563EB"]
      : ["#2563EB", "#1E40AF"],

  gradienteSecundario:
    darkMode
      ? ["#2563EB", "#3B82F6"]
      : ["#3B82F6", "#2563EB"]
};