import { parseAsString, useQueryState } from "nuqs";

export const useEditItemModal = () => {
  const [itemId, setItemId] = useQueryState("edit-item", parseAsString);
  const open = (id: string) => setItemId(id);
  const close = () => setItemId(null);

  return {
    itemId,
    setItemId,
    open,
    close,
  };
};
