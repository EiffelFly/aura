"use client";

import { api } from "../react";

export const useUpdateWorkOnSuccessUpdater = ({
  workspace_id,
}: {
  workspace_id: string;
}) => {
  const utils = api.useUtils();

  // We will solve the any data later
  return (data: any) => {
    const target = data[0];
    if (target) {
      utils.works.by_id.setData({ id: target.id }, () => target);
      utils.works.all.setData({ workspace_id }, (prev) => {
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
