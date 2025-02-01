"use client";

import GameHeader from "./header";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-[url(/bg-table.jpg)] h-svh w-svw bg-cover p-10 bg-center">
      <GameHeader />
      {children}
    </main>
  );
}
