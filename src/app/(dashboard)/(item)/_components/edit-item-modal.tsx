"use client";
import { EditItemFormWrapper } from "@/app/(dashboard)/(item)/_components/edit-item-wrapper";
import { useEditItemModal } from "@/app/(dashboard)/(item)/_hooks/use-edit-item-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
export const EditTaskModal = () => {
  const { itemId, close } = useEditItemModal();

  return (
    <ResponsiveModal open={!!itemId} onOpenChange={close}>
      {itemId && <EditItemFormWrapper itemId={itemId} onCancel={close} />}
    </ResponsiveModal>
  );
};
