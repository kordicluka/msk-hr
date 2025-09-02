import React from "react";
import Image from "next/image";
import SignInForm from "@/components/organisms/admin/SignInForm";

export default async function SignInPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-row items-start justify-start">
      <div className="w-0 xl:w-3/5 lg:w-1/2 h-full hidden md:block">
        <Image
          src="/services/software-development/AdobeStock_471463653.jpeg"
          alt="Login page image"
          width={4000}
          height={4000}
          className="w-full h-full object-cover hidden md:block"
        />
      </div>
      <SignInForm />
    </main>
  );
}
