import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface useGetItemProps {
  itemId: string;
}

export const useGetItem = ({ itemId }: useGetItemProps) => {
  const query = useQuery({
    queryKey: ["vault-items", itemId],
    queryFn: async () => {
      const response = await client.api.item[":itemId"].$get({
        param: { itemId },
      });
      if (!response.ok) {
        return Error("Failed to fetch item");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
