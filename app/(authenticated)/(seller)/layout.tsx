import { getServerUser } from "@/lib/auth/server";
import { Suspense } from "react";
import Loading from "./loading";
import { redirect } from "next/navigation";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getServerUser();

  if (!user?.roles.includes("ROLE_SELLER")) {
    redirect("/login?msg=Insufficient%20permissions&callbackUrl=/seller");
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
