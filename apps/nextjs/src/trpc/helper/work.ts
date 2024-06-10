"use client";

import { api } from "../react";

export const useUpdateWorkOnSuccessUpdater = () => {
  const utils = api.useUtils();

  // We will solve the any data later
  return (data: any) => {
    const target = data[0];
    if (target) {
      utils.works.byId.setData({ id: target.id }, () => target);
      utils.works.all.setData(undefined, (prev) => {
        if (!prev) {
          return [target];
        }

        return prev.map((work) => {
          if (work.id === target.id) {
            return target;
          }

          return work;
        });
      });
    }
  };
};
