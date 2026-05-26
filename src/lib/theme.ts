import { StyleSheet } from "react-native";

export const colors = {
  bg: "#F4F1EA",
  surface: "#FFFFFF",
  border: "#1C1C1C",
  text: "#1C1C1C",
  textSecondary: "#5A5A5A",
  accent: "#C94B32",
  accentSecondary: "#2B5F8A",
  success: "#2B7A4B",
  warning: "#C98A1A",
  error: "#C94B32",
  muted: "#D4CEC4",
  cardBg: "#FFFFFF",
  headerBg: "#1C1C1C",
};

export const shadows = {
  small: {
    shadowColor: "#1C1C1C",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  medium: {
    shadowColor: "#1C1C1C",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  large: {
    shadowColor: "#1C1C1C",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
};

export const border = {
  default: {
    borderWidth: 2,
    borderColor: colors.border,
  },
  accent: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: colors.text,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: colors.text,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    color: colors.text,
  },
  small: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
};

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenPadding: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
  },
  cardShadow: {
    shadowColor: "#1C1C1C",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    padding: 14,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  button: {
    backgroundColor: colors.accent,
    padding: 14,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: "#1C1C1C",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    padding: 14,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: "#1C1C1C",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.surface,
    letterSpacing: 0.3,
  },
  buttonTextSecondary: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: 0.3,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: colors.border,
  },
  separator: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
});

export function getEventColor(type: string): string {
  const map: Record<string, string> = {
    exam: colors.error,
    assignment: colors.warning,
    university_event: colors.accentSecondary,
    class: colors.success,
    extracurricular: "#7C3AED",
  };
  return map[type] || colors.textSecondary;
}

export function getEventLabel(type: string): string {
  const map: Record<string, string> = {
    exam: "EXAM",
    assignment: "TASK",
    university_event: "EVENT",
    class: "CLASS",
    extracurricular: "ACTIVITY",
  };
  return map[type] || type.toUpperCase();
}
