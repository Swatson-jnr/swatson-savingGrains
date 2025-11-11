"use client";

import { useEffect } from "react";
import { toast, Toaster } from "sonner";
import { FlashMessage, LayoutProps } from "@/types";

export function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      {children}

      <Toaster
        richColors
        toastOptions={{ duration: 6000 }}
        position="top-center"
      />
    </>
  );
}
