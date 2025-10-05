// import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/app/(auth)/_components/sign-up-card";
import { getCurrentUser } from "@/routes/queries";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await getCurrentUser();
  if (user) redirect("/");
  return <SignUpCard />;
};

export default SignUpPage;
