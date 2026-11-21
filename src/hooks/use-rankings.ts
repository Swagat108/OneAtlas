import { useQuery } from "@tanstack/react-query";

export function useRankings(category?: string, benchmark?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (benchmark) params.set("benchmark", benchmark);

  return useQuery({
    queryKey: ["rankings", category ?? "ALL", benchmark ?? "DEFAULT"],
    queryFn: async () => {
      const res = await fetch(`/api/rankings?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch rankings");
      }
      const json = await res.json();
      return json.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}
