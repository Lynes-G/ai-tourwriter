"use client";

import { PagerComponent } from "@syncfusion/ej2-react-grids";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

interface PagerProps {
  totalRecordsCount: number;
  pageSize: number;
  currentPage: number;
  basePath?: string;
}

export default function ClientPagination({
  totalRecordsCount,
  pageSize,
  currentPage,
  basePath = "/trips",
}: PagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNavigatingRef = useRef(false);

  const handlePageChange = useCallback(
    (page: number) => {
      // Prevent multiple rapid calls
      if (isNavigatingRef.current) return;

      // Don't navigate if it's the same page
      if (page === currentPage) return;

      isNavigatingRef.current = true;

      try {
        const params = new URLSearchParams(searchParams.toString());

        if (page === 1) {
          params.delete("page");
        } else {
          params.set("page", page.toString());
        }

        const query = params.toString();
        const url = query ? `${basePath}?${query}` : basePath;

        router.push(url);

        // Reset the flag after navigation
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      } catch (error) {
        console.error("Navigation error:", error);
        isNavigatingRef.current = false;
      }
    },
    [router, searchParams, basePath, currentPage],
  );

  return (
    <div className="mt-8 flex justify-center">
      <PagerComponent
        totalRecordsCount={totalRecordsCount}
        pageSize={pageSize}
        currentPage={currentPage}
        click={(args: any) => {
          // Prevent default behavior and stop propagation
          if (args.originalEvent) {
            args.originalEvent.preventDefault();
            args.originalEvent.stopPropagation();
          }

          handlePageChange(args.currentPage);
        }}
        cssClass="!mb-4"
      />
    </div>
  );
}
