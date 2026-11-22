import { useQuery } from "@tanstack/react-query";

export interface BenchmarkListItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  maxScore: number;
  higherIsBetter: boolean;
  _count: {
    scores: number;
  };
}

export function useBenchmarks() {
  return useQuery<BenchmarkListItem[]>({
    queryKey: ["benchmarks"],
    queryFn: async () => {
      const res = await fetch("/api/benchmarks");
      if (!res.ok) {
        throw new Error("Failed to fetch benchmarks");
      }
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useBenchmarkDetail(slug: string) {
  return useQuery({
    queryKey: ["benchmark", slug],
    queryFn: async () => {
      const res = await fetch(`/api/benchmarks/${slug}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch benchmark: ${slug}`);
      }
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(slug),
  });
}
