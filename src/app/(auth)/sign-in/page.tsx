import { SignInCard } from "@/app/(auth)/_components/sign-in-card";
import { getCurrentUser } from "@/routes/queries";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = await getCurrentUser();
  if (user) redirect("/");

  return <SignInCard />;
};

export default SignInPage;
