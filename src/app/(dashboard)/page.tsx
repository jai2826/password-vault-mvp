// app/page.tsx
import PasswordGenerator from "@/components/password-generator";
import VaultPanel from "@/components/vault-panel";
import AuthForm from "@/components/auth-form";
import { getCurrentUser } from "@/routes/queries";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  // if (!user) {
  //   redirect("/sign-in");
  // }
  const isLoggedIn = !!user;
  return (
    <div className="space-y-10">
      {isLoggedIn ? (
        <>
          <h1 className="text-4xl font-extrabold text-center pt-8 text-gray-900">
            Secure Vault Dashboard
          </h1>

          <PasswordGenerator />

          <VaultPanel />

          <div className="text-center mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
            <p className="text-sm">
              **Note:** This is the UI mock. In the final implementation,
              encryption/decryption happens client-side, and only ciphertexts
              are sent to/from the API.
            </p>
          </div>
        </>
      ) : (
        <div className="py-20">
          <AuthForm />
        </div>
      )}
    </div>
  );
}
