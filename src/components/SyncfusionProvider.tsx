"use client";

import { useEffect } from "react";

export default function SyncfusionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register Syncfusion license key on the client side
    import("@syncfusion/ej2-base").then(({ registerLicense }) => {
      registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY || "");
    });
  }, []);

  return <>{children}</>;
}
