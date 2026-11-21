import { useQuery } from "@tanstack/react-query";

export function useFilters() {
  return useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const res = await fetch("/api/filters");
      if (!res.ok) throw new Error("Failed to fetch filters");
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
