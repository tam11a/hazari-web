"use client";

export default function WelcomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-[url(/bg-welcome.jpg)] h-svh w-svw bg-cover p-10 bg-center flex flex-col items-center justify-center">
      {children}
    </main>
  );
}
