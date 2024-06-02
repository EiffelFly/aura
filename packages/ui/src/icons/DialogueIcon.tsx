import * as React from "react";

import { IconProps } from "./type";

export const DialogueIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ ...props }, forwardedRef) => {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M3.55263 11.0066C4.29138 11.3684 5.12198 11.5716 6.00002 11.5716C9.07707 11.5716 11.5714 9.0772 11.5714 6.00014C11.5714 2.92313 9.07707 0.428711 6.00002 0.428711C2.923 0.428711 0.428589 2.92313 0.428589 6.00014C0.428589 7.14238 0.77232 8.20433 1.36198 9.08817M3.55263 11.0066L0.428589 11.5716L1.36198 9.08817M3.55263 11.0066L3.55716 11.0059M1.36198 9.08817L1.36287 9.08585"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
);
