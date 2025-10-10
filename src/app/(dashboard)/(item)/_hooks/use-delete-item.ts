import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type ResponseType = InferResponseType<
  (typeof client.api.item)[":itemId"]["$delete"]
>;
// type RequestType = InferRequestType<(typeof client.api.auth.logout)["$post"]>;
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, { itemId: string }>({
    mutationFn: async ({ itemId }) => {
      const response = await client.api.item[":itemId"].$delete({ param: { itemId } });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Item deleted");
      queryClient.invalidateQueries({ queryKey: ["vault-items"] });
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });

  return mutation;
};
