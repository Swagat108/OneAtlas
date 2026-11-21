import { useQuery } from "@tanstack/react-query";

export function useCompareModels(slugs: string[]) {
  const sortedKey = [...slugs].sort().join(",");

  return useQuery({
    queryKey: ["compare", sortedKey],
    queryFn: async () => {
      if (slugs.length < 2) return null;
      const res = await fetch(`/api/models/compare?slugs=${slugs.join(",")}`);
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error?.message || "Failed to compare models");
      }
      const json = await res.json();
      return json.data;
    },
    enabled: slugs.length >= 2,
    staleTime: 2 * 60 * 1000,
  });
}
