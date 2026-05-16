import AuthWrapper from "@/components/auth/auth-wrapper";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthWrapper
      title="Welcome back"
      subtitle="Sign in to continue to TaskFlow"
    >
      <LoginForm />
    </AuthWrapper>
  );
}
