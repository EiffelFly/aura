import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

export const useKeyboard = () => {
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "g" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        console.log(pathname);
        if (pathname === "/") {
          router.push("/overview");
        } else if (pathname.split("/")[1] === "overview") {
          router.push("/");
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [pathname]);
};
