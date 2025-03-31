import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
