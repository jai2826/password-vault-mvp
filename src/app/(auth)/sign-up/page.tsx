import { SignUpCard } from "@/app/(auth)/_components/sign-up-card";
import PasswordGenerator from "@/components/password-generator";
const SignUpPage = async () => {
  return (
    <div className="w-full items-center lg:items-stretch flex flex-col lg:flex-row gap-4 lg:gap-10 justify-center">
      <SignUpCard />
      <PasswordGenerator />
    </div>
  );
};

export default SignUpPage;
