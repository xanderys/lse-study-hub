import { trpc } from "@/lib/trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  return {
    user: user || null,
    isAuthenticated: true, // Always authenticated in local mode
    loading: isLoading,
  };
}
