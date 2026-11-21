import { useQuery } from "@tanstack/react-query";

export function useModelDetail(slug: string) {
  return useQuery({
    queryKey: ["model", slug],
    queryFn: async () => {
      const res = await fetch(`/api/models/${slug}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch model: ${slug}`);
      }
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(slug),
  });
}
