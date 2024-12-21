"use client";

import Link from "next/link";

import { Button, Separator, Card } from "@fucina/ui";
import AuthButtons from "@/components/auth/auth-buttons";
import useIsAccessingAnotherWorkspace from "@/app/(auth)/login/useIsAccessingAnotherWorkspace";

export default async function Login() {
  const isAccessingAnotherWorkspace = useIsAccessingAnotherWorkspace();
  return (
    <Card className="relative z-30 flex flex-col space-y-6 p-6 sm:p-10 max-w-[400px]">
      <div className="flex flex-col items-center space-y-3 text-center">
        <h1 className="text-heading-section">
          {isAccessingAnotherWorkspace ? "Welcome!" : "Welcome back"}
        </h1>
        <p className="text-description text-md">
          {isAccessingAnotherWorkspace
            ? "Hey, just one more step before you can leave your idea"
            : "Hey, look who's back! Ready to jump back in?"}
        </p>
      </div>
      <Separator />
      <div className="w-full">
        <AuthButtons />
      </div>
      {!isAccessingAnotherWorkspace && (
        <div className="items-center gap-4 grid">
          <Separator />
          <div className="flex sm:flex-row flex-col justify-center items-center gap-1 sm:gap-0">
            <p className="text-description text-md">
              Don&apos;t have an account?
            </p>
            <Button variant="link" asChild>
              <Link href={"/signup"}>Sign up</Link>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
