"use client";
import { UserButton } from "@/components/user-button";

export const Navbar = () => {
  return (
    <nav className="pt-4 w-full px-6 flex items-center justify-between">
      <div className="ml-auto">
        <UserButton />
      </div>
    </nav>
  );
};
