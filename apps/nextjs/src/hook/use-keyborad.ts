import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

export const useKeyboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "g" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        const pathNameArray = pathname.split("/");

        if (
          pathNameArray.length === 4 &&
          pathNameArray[1] &&
          pathNameArray[2] === "works" &&
          pathNameArray[3]
        ) {
          router.push(`/${pathNameArray[1]}/works`);
          return;
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [pathname]);
};
