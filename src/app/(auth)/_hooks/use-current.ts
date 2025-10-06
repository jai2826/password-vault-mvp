import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { IUser } from "@/models/User";

export const useCurrent = () => {
  const query = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth.current.$get();
      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();
      return data as unknown as IUser;
    },
  });
  return query;
};
