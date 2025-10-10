// components/VaultPanel.tsx
"use client";
import { useGetItems } from "@/app/(dashboard)/(item)/_api/use-get-items";
import { useCreateItem } from "@/app/(dashboard)/(item)/_hooks/use-create-item";
import { useDeleteItem } from "@/app/(dashboard)/(item)/_hooks/use-delete-item";
import { useEditItemModal } from "@/app/(dashboard)/(item)/_hooks/use-edit-item-modal";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you added Textarea via shadcn-ui
import { cn, decryptData } from "@/lib/utils";
import { createItemSchema } from "@/routes/item/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Copy,
  Eye,
  EyeOff,
  Loader,
  Pencil,
  Plus,
  Search,
  Trash2,
  User
} from "lucide-react";
import mongoose from "mongoose";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Mock Data (Type definition should be created in types/vault.ts)
interface VaultItem {
  _id: string;
  user: mongoose.Types.ObjectId;
  title: string;
  email: string;
  password: string;
  url?: string;
  notes?: string;
}

export default function VaultPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<VaultItem | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteItem();
  const { data: items, isLoading } = useGetItems();

  const isVaultItemArray = (arr: unknown): arr is VaultItem[] =>
    Array.isArray(arr) &&
    arr.every((item) => typeof item === "object" && item !== null);

  let filteredItems: VaultItem[] = [];
  let itemsLength = 0;
  if (isVaultItemArray(items)) {
    filteredItems = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    itemsLength = items.length;
  }

  const handleSave = (
    item: Omit<VaultItem, "_id" | "user">,
    isNew: boolean
  ) => {
    console.log(
      isNew
        ? "Saving new item (will encrypt):"
        : "Updating item (will re-encrypt):",
      item
    );

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (_id: string) => {
    deleteMutate(
      { itemId: _id },
      {
        onSuccess() {
          toast.success("Item deleted successfully");
        },
      }
    );
  };

  const openModal = (item: VaultItem | null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <Card className="w-full lg:w-[487px] md:w-[600px] border-none shadow-none ">
      <CardHeader className="p-7 flex flex-row items-center justify-between">
        <CardTitle className="text-primary text-2xl">
          Your Secure Vault ({itemsLength || 0} Entries)
        </CardTitle>
        <Button
          size={"lg"}
          onClick={() => openModal(null)}
          className="flex items-center text-sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add New
        </Button>
      </CardHeader>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by Title or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        {/* Vault Items List */}

        <div
          className={cn(
            "space-y-3 w-full max-h-[250px] overflow-y-auto",
            isLoading && "flex items-center justify-center h-48"
          )}
        >
          {isLoading ? (
            <Loader className="size-6  mx-auto mt-10 animate-spin text-muted-foreground" />
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No entries found.
            </p>
          ) : (
            filteredItems.map((item) => (
              <VaultItemRow
                key={item._id}
                item={item}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            ))
          )}
        </div>
      </CardContent>

      {/* Modal for Add/Edit */}
      <VaultItemModal
        open={isModalOpen}
        item={editingItem!}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </Card>
  );
}

interface VaultItemRowProps {
  item: VaultItem;
  // onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const VaultItemRow: React.FC<VaultItemRowProps> = ({
  item,
  // onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const { open } = useEditItemModal();
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const itemPassword = decryptData(item.password);
  const handleCopy = () => {
    if (!item.password) return;
    navigator.clipboard.writeText(item.password);
    setCopied(true);

    // Auto-clear (Must-have)
    setTimeout(() => {
      navigator.clipboard.writeText(""); // Overwrite
      setCopied(false);
    }, 15000); // 15 seconds
  };

  // const decryptedPassword = decryptData(item.password); // Replace with actual decryption logic

  return (
    <div className="flex items-center bg-accent/10 p-3 rounded-md hover:bg-accent/30 transition border border-border">
      <div className="flex-grow min-w-0">
        <p className="font-semibold truncate text-primary">{item.title}</p>
        <p className="text-sm text-muted-foreground truncate flex items-center">
          <User className="w-3 h-3 mr-1" /> {item.email}
        </p>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {/* Password Display */}
        <div className="relative ">
          <Input
            type={showPassword ? "text" : "password"}
            value={itemPassword ?? ""}
            readOnly
            className="w-32 h-8 py-0 px-2 text-sm font-mono truncate border-none focus-visible:ring-0"
          />
          <Button
            type="button" // Important: Prevent button from submitting the form
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => {
              console.log("first");
              setShowPassword((prev) => !prev);
            }}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 opacity-50" />
            ) : (
              <Eye className="h-4 w-4 opacity-50" />
            )}
          </Button>
        </div>

        {/* Copy Button (Must-have) */}
        <Button
          onClick={handleCopy}
          title="Copy Password"
          size="icon"
          className={copied ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <Copy className="w-4 h-4" />
        </Button>

        {/* Action Buttons */}
        <Button
          onClick={() => open(item._id)}
          title="Edit Entry"
          variant="outline"
          size="icon"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onDelete(item._id)}
          disabled={isDeleting}
          title="Delete Entry"
          variant="destructive"
          size="icon"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

interface VaultItemModalProps {
  open: boolean;
  item: VaultItem | null;
  onSave: (item: Omit<VaultItem, "_id" | "user">, isNew: boolean) => void;
  onClose: () => void;
}

const VaultItemModal: React.FC<VaultItemModalProps> = ({
  open,
  item,
  onSave,
  onClose,
}) => {
  const isNew = !item;

  const { mutate, isPending } = useCreateItem();
  const defaultValues = {
    title: item?.title || "",
    email: item?.email || "",
    password: item?.password || "",
    url: item?.url || "",
    notes: item?.notes || "",
  };
  const form = useForm<z.infer<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      ...(item
        ? {
            title: item.title,
            email: item.email,
            password: item.password,
            url: item.url,
            notes: item.notes,
          }
        : {}),
      ...defaultValues,
    },

    mode: "onChange",
  });
  const onSubmit = (values: z.infer<typeof createItemSchema>) => {
    mutate(
      { json: values },
      {
        onSuccess() {
          onSave(values, isNew);
          form.reset();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {isNew ? "Add New Vault Item" : `Edit: ${item?.title}`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Enter title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Enter email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Enter password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder="Enter URL"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      placeholder="Enter notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={data.notes}
                onChange={handleChange}
                rows={3}
              />
            </div> */}
            <DottedSeparator className="py-7" />
            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isNew ? "Save Item (Encrypt)" : "Update Item (Re-Encrypt)"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
