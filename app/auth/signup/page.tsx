    import AuthWrapper from "@/components/auth/auth-wrapper";
    import SignupForm from "@/components/auth/signup-form";

    export default function SignupPage() {
      return (
        <AuthWrapper
          title="Create account"
          subtitle="Get started with TaskFlow in seconds"
        >
          <SignupForm />
        </AuthWrapper>
      );
}
