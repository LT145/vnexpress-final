"use client";

import { signUpSchema } from "@/lib/validation";
import { signUp } from "@/actions/auth";
import AuthForm from "@/components/auth-form";
import RegisterForm from "@/components/RegisterForm";

const SignUpPage = () => {
  return (
    <RegisterForm
      email=""
      onBack={() => {}}
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      onSubmit={signUp}
    />
  );
};

export default SignUpPage;
