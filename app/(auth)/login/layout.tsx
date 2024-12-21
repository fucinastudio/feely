import { Suspense } from "react";
import autoLogin from "@/utils/autoLogIn";

import Loading from "@/app/loading";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await autoLogin();
  return (
    <Suspense fallback={<Loading className="relative z-50 min-h-[60vh]" />}>
      {children}
    </Suspense>
  );
}
