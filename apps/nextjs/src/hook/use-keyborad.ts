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

        console.log(pathname, pathNameArray);

        if (pathNameArray.length === 2 && pathNameArray[1]) {
          router.push(`${pathname}/overview/works`);
        } else if (
          pathNameArray.length === 3 &&
          pathname.split("/")[2] === "overview"
        ) {
          router.push(`/${pathNameArray[1]}`);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [pathname]);
};
