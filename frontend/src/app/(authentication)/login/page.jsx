import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/components/forms/LoginForm";

export const metadata = {
  title: "Sign In - VegaRecords",
  description: "Sign in to your VegaRecords personal operating system.",
};

export default function LoginPage() {
  return (
    <AuthLayout subtitle="Welcome back! Sign in to access your workspace.">
      <LoginForm />
    </AuthLayout>
  );
}
