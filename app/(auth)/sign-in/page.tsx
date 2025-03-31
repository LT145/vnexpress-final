"use client"

import { signInWithCredential } from "@/actions/auth";
import AuthForm from "@/components/auth-form";  // Make sure this imports AuthForm
import { signInSchema } from "@/lib/validation";
import { useState } from "react";

const SignInPage = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      const result = await signInWithCredential(values);
      return { success: result.success, error: result.error };
    } catch (error) {
      return { success: false, error: 'Đăng nhập thất bại' };
    }
  };

  if (isSignedIn) {
    return <div>Redirecting to dashboard...</div>;
  }

  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={handleSignIn}
      onClose={() => {}}
    />
  );
};

export default SignInPage;
