import { Redirect } from "expo-router";
import { useAuth } from "../lib/AuthContext";

export default function Index() {
  const { user } = useAuth();
  if (user) {
    if (user.role === "student") return <Redirect href="/(student)/dashboard" />;
    if (user.role === "faculty") return <Redirect href="/(faculty)/dashboard" />;
    return <Redirect href="/(admin)/command-centre" />;
  }
  return <Redirect href="/(auth)/login" />;
}
