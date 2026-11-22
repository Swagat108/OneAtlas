import { useQuery } from "@tanstack/react-query";

export interface HomeData {
  stats: {
    modelsCount: number;
    labsCount: number;
    providersCount: number;
    benchmarksCount: number;
  };
  featuredModels: {
    slug: string;
    name: string;
    lab: string;
    labSlug: string;
    logoUrl?: string | null;
    badge: string;
    desc: string;
    context: string;
    price: string;
  }[];
}

export function useHomeData() {
  return useQuery<HomeData>({
    queryKey: ["home-data"],
    queryFn: async () => {
      const res = await fetch("/api/home");
      if (!res.ok) {
        throw new Error("Failed to load home data");
      }
      const json = await res.json();
      return json.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
