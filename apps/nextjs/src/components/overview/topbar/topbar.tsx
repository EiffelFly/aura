"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export const Topbar = () => {
  const pathName = usePathname();

  const displayPath = React.useMemo(() => {
    const pathNameArray = pathName.split("/");

    if (pathNameArray.includes("works")) {
      return "Works";
    }

    if (pathNameArray.includes("characters")) {
      return "Characters";
    }

    if (pathNameArray.includes("dialogues")) {
      return "Dialogues";
    }
  }, [pathName]);

  return (
    <div className="flex h-[var(--topbar-height)] w-full flex-shrink-0 flex-row items-center border-b border-border px-4">
      <p className="font-sans text-base font-normal text-secondary">
        {displayPath}
      </p>
    </div>
  );
};
