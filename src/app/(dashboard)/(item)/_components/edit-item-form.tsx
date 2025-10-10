"use client";
import { useUpdateItem } from "@/app/(dashboard)/(item)/_hooks/use-update-item";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { decryptData } from "@/lib/utils";
import { IItem } from "@/models/Item";
import { updateItemSchema } from "@/routes/item/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface EditItemFormProps {
  onCancel?: () => void;
  initialValues: IItem;
}

export const EditItemForm = ({
  onCancel,
  initialValues,
}: EditItemFormProps) => {
  const { mutate, isPending } = useUpdateItem();
  const [showPassword, setShowPassword] = useState(false);

  const newInitialValues = {
    ...initialValues,
    password: decryptData(initialValues?.password as string) ?? undefined,
  };

  const form = useForm<z.infer<typeof updateItemSchema>>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: newInitialValues,
  });

  const onSubmit = (values: z.infer<typeof updateItemSchema>) => {
    mutate(
      { json: values, param: { itemId: initialValues._id as string } },
      
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none  ">
      <CardHeader className="flex px-7 py-4">
        <CardTitle className="text-xl font-bold">Edit Item</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
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
                    <div className="relative flex items-center border rounded-md bg-background">
                      <Input
                        {...field}
                        placeholder="Enter password"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                      />
                      <Button
                        type="button" // Important: Prevent button from submitting the form
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 opacity-50" />
                        ) : (
                          <Eye className="h-4 w-4 opacity-50" />
                        )}
                      </Button>
                    </div>
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

            <DottedSeparator className="py-7" />
            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {"Update Item (Re-Encrypt)"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
