// components/AuthForm.tsx
"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type AuthMode = "LOGIN" | "SIGNUP";

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${mode} attempted with: ${email}, ${password}`);
    // TODO: Hook into NextAuth.js or custom API route here.
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          Secure Vault {mode === "LOGIN" ? "Login" : "Sign Up"}
        </CardTitle>
        <CardDescription>
          {mode === "LOGIN"
            ? "Enter your credentials to unlock the vault."
            : "Create a master account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Master Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full mt-2">
            {mode === "LOGIN" ? "Log In & Unlock Vault" : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setMode(mode === "LOGIN" ? "SIGNUP" : "LOGIN")}
        >
          {mode === "LOGIN"
            ? "Need an account? Sign Up"
            : "Already have an account? Log In"}
        </Button>
      </CardFooter>
    </Card>
  );
}
