import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { IItem } from "@/models/Item";
type ResponseType = InferResponseType<
  (typeof client.api.item)[":itemId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.item)[":itemId"]["$patch"]
>;
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.item[":itemId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Item updated");

      queryClient.invalidateQueries({ queryKey: ["vault-items"] });

      queryClient.invalidateQueries({
        queryKey: ["vault-items", (data as unknown as IItem)._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["vault-items"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to update item");
    },
  });

  return mutation;
};
