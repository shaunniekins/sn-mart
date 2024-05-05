"use client";

import { usePathname } from "next/navigation";

export function useMyPath() {
  const path = usePathname();
  console.log("pattaaaaaaah: ", path);
  return path;
}
