import { useGetItem } from "@/app/(dashboard)/(item)/_api/use-get-item";
import { EditItemForm } from "@/app/(dashboard)/(item)/_components/edit-item-form";
import { Card, CardContent } from "@/components/ui/card";
import { IItem } from "@/models/Item";
import { Loader } from "lucide-react";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  itemId: string;
}

export const EditItemFormWrapper = ({
  onCancel,
  itemId,
}: EditTaskFormWrapperProps) => {
  const { data, isLoading } = useGetItem({ itemId }) as {
    data: IItem | undefined;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none ">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.password) {
    return null;
  }

  return (
    <div>
      <EditItemForm
        initialValues={data as unknown as IItem}
        onCancel={onCancel}
      />
    </div>
  );
};
