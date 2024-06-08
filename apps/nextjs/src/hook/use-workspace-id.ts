"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function useWorkspaceId() {
  const pathname = usePathname();

  const workspaceId = React.useMemo(() => {
    const pathNameArray = pathname.split("/");

    if (pathNameArray[1] && pathNameArray.length > 0) {
      return pathNameArray[1];
    }

    return null;
  }, [pathname]);

  return workspaceId;
}
