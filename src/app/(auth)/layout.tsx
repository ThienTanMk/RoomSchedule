import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Room Schedule",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}
