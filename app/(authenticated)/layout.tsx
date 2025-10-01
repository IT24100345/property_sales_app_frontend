import { Toaster } from "sonner";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <div>
    <main>{children}</main>
    <Toaster />
  </div>
}