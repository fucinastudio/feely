import { redirect } from "next/navigation";

export default function RootLayout({
  children,
  params: { org },
}: Readonly<{
  children: React.ReactNode;
  params: { org: string };
}>) {
  //Commented for the moment while we implement legal stuff
  redirect(`/${org}/settings/general`);
  return children;
}
