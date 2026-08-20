import AuthLayout from "@/layouts/AuthLayout";
import RegisterForm from "@/components/forms/RegisterForm";

export const metadata = {
  title: "Create Account - VegaRecords",
  description: "Join VegaRecords to build your ultimate personal knowledge hub.",
};

export default function RegisterPage() {
  return (
    <AuthLayout subtitle="Create your VegaRecords account to get started.">
      <RegisterForm />
    </AuthLayout>
  );
}
