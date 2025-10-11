"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";

import { useRegister } from "@/app/(auth)/_hooks/use-register";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/routes/schemas";
import { usePasswordStore } from "@/store/usePassword";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const SignUpCard = () => {
  const { mutate, isPending: isRegistering } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const generatedStrongPassword = usePasswordStore(
    (state) => state.generatedStrongPassword
  );
  console.log(generatedStrongPassword);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ json: values });
  };

  useEffect(() => {
    form.setValue("password", generatedStrongPassword, {
      shouldValidate: true, // Optionally re-run validation
      shouldDirty: true, // Mark the field as changed
    });
  }, [generatedStrongPassword, form]);
  return (
    <Card className="w-full md:w-[600px] lg:w-[487px] border-none shadow-none">
      <CardHeader className="flex flex-col items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By Signing up, you agree to our{" "}
          <Link href={"/privacy"}>
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href={"/terms"}>
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7 mb-2">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="string"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative ">
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
            <Button disabled={isRegistering} size={"lg"} className="w-full">
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account?
          <Link href={"/sign-in"}>
            <span className="text-blue-700">&nbsp;Login</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
