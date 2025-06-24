"use client";

import dynamic from "next/dynamic";

const SidebarComponent = dynamic(
  () =>
    import("@syncfusion/ej2-react-navigations").then((mod) => ({
      default: mod.SidebarComponent,
    })),
  {
    ssr: false,
    loading: () => <div>Loading sidebar...</div>,
  },
);

export default function Sidebar() {
  return <div>Sidebar</div>;
}
