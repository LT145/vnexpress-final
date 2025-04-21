"use client"

import { signInWithCredential } from "@/actions/auth";
import AuthForm from "@/components/auth-form";  // Make sure this imports AuthForm
import { signInSchema } from "@/lib/validation";
import { useEffect } from "react";

const SignInPage = ({ searchParams }: { searchParams: { error?: string } }) => {

  // Add this useEffect to handle the error in the URL
  useEffect(() => {
    if (searchParams?.error === 'OAuthAccountNotLinked') {
      // Clear the error from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      const result = await signInWithCredential(values);
      return { success: result.success, error: result.error };
    } catch (error) {
      console.error('Sign-in error:', error);
      return { success: false, error: 'Đăng nhập thất bại' };
    }
  };

  return (
    <>
      <AuthForm
        type="SIGN_IN"
        schema={signInSchema}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSignIn}
        onClose={() => {}}
        error={searchParams?.error}
      />
    </>
  );
};

export default SignInPage;
