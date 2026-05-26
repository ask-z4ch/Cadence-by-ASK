import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUser(userId: string | undefined) {
  return useQuery(
    api.auth.getMe,
    userId ? { userId: userId as any } : "skip"
  );
}
