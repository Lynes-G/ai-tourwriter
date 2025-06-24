"use client";

import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { useEffect, useState } from "react";
import { NavItems } from "@/components";

interface ClientSidebarProps {
  children?: React.ReactNode;
  width?: number;
  enableGestures?: boolean;
}

export default function ClientSidebar({
  children,
  width = 270,
  enableGestures = false,
}: ClientSidebarProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full max-w-[270px] border-r border-gray-200 bg-white p-4">
        <NavItems />
      </div>
    );
  }

  return (
    <SidebarComponent width={width} enableGestures={enableGestures}>
      {children || <NavItems />}
    </SidebarComponent>
  );
}
