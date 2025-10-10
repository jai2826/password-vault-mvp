import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type ResponseType = InferResponseType<
  (typeof client.api.item.createItem)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.item.createItem)["$post"]
>;
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.item.createItem["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Item Created");
      queryClient.invalidateQueries({ queryKey: ["vault-items"] });
    },
    onError: () => {
      toast.error("Failed to create item");
    },
  });

  return mutation;
};
