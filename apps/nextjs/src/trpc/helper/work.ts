"use client";

import * as React from "react";

import { api } from "../react";

export const useUpdateWorkOnSuccessUpdater = ({
  workspaceId,
}: {
  workspaceId: string | null;
}) => {
  if (!workspaceId) {
    return null;
  }

  const utils = api.useUtils();

  // We will solve the any data later
  return React.useCallback(
    (data: any) => {
      const target = data[0];
      if (target) {
        utils.works.byId.setData({ workId: target.id }, () => target);
        utils.works.all.setData({ workspaceId }, (prev) => {
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
    },
    [workspaceId],
  );
};
