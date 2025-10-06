// import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/app/(auth)/_components/sign-up-card";
import PasswordGenerator from "@/components/password-generator";
import { getCurrentUser } from "@/routes/queries";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await getCurrentUser();
  if (user) redirect("/");
  return (
    <div className="w-full items-center lg:items-stretch flex flex-col lg:flex-row gap-4 lg:gap-10 justify-center">
      <SignUpCard />
      <PasswordGenerator />
    </div>
  );
};

export default SignUpPage;
