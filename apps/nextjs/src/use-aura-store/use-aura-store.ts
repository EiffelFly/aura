import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

import { createGeneralSlice } from "./general-slice";
import { AuraStore } from "./type";

export const useAuraStore = create<AuraStore>()(
  subscribeWithSelector(
    devtools((...a) => ({
      ...createGeneralSlice(...a),
    })),
  ),
);
