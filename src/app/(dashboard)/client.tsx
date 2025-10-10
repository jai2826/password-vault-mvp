"use client";
import PasswordGenerator from "@/components/password-generator";
import VaultPanel from "@/components/vault-panel";

export const DashboardClientPage = () => {
  return (
    <div className="space-y-10 w-full flex flex-col">
      <h1 className="text-4xl font-extrabold text-center pt-8 text-primary">
        Secure Vault Dashboard
      </h1>
      <div className="w-full items-center lg:items-stretch flex flex-col lg:flex-row gap-4 lg:gap-10 justify-center">
        <PasswordGenerator />

        <VaultPanel />
      </div>
    </div>
  );
}
