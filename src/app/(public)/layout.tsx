import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Room Schedule",
};

export default function PublicLayout({
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
