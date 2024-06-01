"use client";

import * as React from "react";

import { useKeyboard } from "~/hook/use-keyborad";

export const Container = ({ children }: { children: React.ReactNode }) => {
  useKeyboard();
  return <main className="h-screen">{children}</main>;
};
