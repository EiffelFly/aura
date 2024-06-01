"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@aura/ui/button";
import { WorkIcon } from "@aura/ui/icons/WorkIcon";

export const NavigationButton = ({
  target,
  title,
  icon,
}: {
  target: string;
  title: string;
  icon?: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push(target);
      }}
      className="flex w-full flex-row items-center justify-start gap-x-3 rounded px-2 py-1 font-sans text-base font-medium text-secondary hover:bg-muted"
    >
      {icon}
      {title}
    </button>
  );
};

export const MainNavigations = () => {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <NavigationButton
        target="/works"
        title="Works"
        icon={<WorkIcon className="h-4 w-4 stroke-secondary" />}
      />
    </div>
  );
};
