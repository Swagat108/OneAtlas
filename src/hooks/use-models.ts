import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useModels(searchParamsString: string) {
  return useQuery({
    queryKey: ["models", searchParamsString],
    queryFn: async () => {
      const url = searchParamsString
        ? `/api/models?${searchParamsString}`
        : "/api/models";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch models");
      }
      const json = await res.json();
      return json;
    },
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
