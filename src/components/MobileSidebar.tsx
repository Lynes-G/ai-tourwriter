// @ts-nocheck
"use client";

import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";

export default function MobileSidebar() {
  let sidebar: SidebarComponent;
  const toggleSidebar = () => {
    if (sidebar) {
      sidebar.toggle();
    }
  };

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link href="/">
          <Image
            src="/pro-logo.svg"
            alt="Logo"
            width={100}
            height={50}
            className="size-[50px]"
          />
        </Link>

        <button onClick={toggleSidebar} className="cursor-pointer">
          <Image
            src="/icons/menu.svg"
            alt="Menu"
            width={24}
            height={24}
            className="size-7"
          />
        </button>
      </header>
      <SidebarComponent
        width={270}
        ref={(Sidebar) => (sidebar = Sidebar)}
        created={() => sidebar.hide()}
        closeOnDocumentClick
        showBackdrop
        type="over"
      >
        <NavItems handleClick={toggleSidebar} />
      </SidebarComponent>
    </div>
  );
}
