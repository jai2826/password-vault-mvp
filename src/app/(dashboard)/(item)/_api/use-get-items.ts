import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetItems = () => {
  const query = useQuery({
    queryKey: ["vault-items"],
    queryFn: async () => {
      const response = await client.api.item["allItems"].$get();
      if (!response.ok) {
        return Error("Failed to fetch items");
      }

      const { data } = await response.json();

      return data;
    },
  });
  return query;
};
