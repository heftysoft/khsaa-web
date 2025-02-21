import { AuthPattern } from "@/components/auth/auth-pattern";
import LoginForm from "@/components/auth/login-form";
import { LoadingSpinner } from "@/components/loading-spinner";
import { MotionDiv } from "@/components/motion";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="relative flex items-center justify-center min-h-screen">
        <AuthPattern />
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoginForm />
        </MotionDiv>
      </div>
    </Suspense>
  );
}
