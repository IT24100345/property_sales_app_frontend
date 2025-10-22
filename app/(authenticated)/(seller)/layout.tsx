"use client";
import { Suspense } from "react";
import Loading from "./loading";

import { useAuth } from "@/lib/auth/AuthContext";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user } = useAuth();

  console.log("SellerLayout user:", user);
  if (!user?.roles.includes("ROLE_SELLER")) {
    console.log(user?.roles);
    //redirect("/login?msg=Insufficient%20permissions&callbackUrl=/seller");
  }

  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
