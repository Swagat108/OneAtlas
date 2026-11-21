import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useSearch(query: string, limit = 5) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  return useQuery({
    queryKey: ["search", debouncedQuery, limit],
    queryFn: async () => {
      if (!debouncedQuery) return { models: [], labs: [], providers: [] };
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=${limit}`);
      if (!res.ok) throw new Error("Search failed");
      const json = await res.json();
      return json.data;
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 30 * 1000,
  });
}
