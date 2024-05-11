import { Button, CircularProgress } from "@nextui-org/react";
import React from "react";

export default function Loading() {
  return (
    <main className="text-center flex items-center justify-center h-[100svh] w-screen">
      <CircularProgress color="secondary" aria-label="Loading..." />
    </main>
  );
}
