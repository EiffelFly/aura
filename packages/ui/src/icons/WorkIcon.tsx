import * as React from "react";

import { IconProps } from "./type";

export const WorkIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
        <g clip-path="url(#clip0_83_276)">
          <path
            d="M10.7142 10.7143C10.7142 10.9416 10.6239 11.1596 10.4632 11.3204C10.3024 11.4811 10.0844 11.5714 9.85707 11.5714H2.14279C1.91546 11.5714 1.69744 11.4811 1.53669 11.3204C1.37595 11.1596 1.28564 10.9416 1.28564 10.7143V1.2857C1.28564 1.05837 1.37595 0.840355 1.53669 0.679609C1.69744 0.518864 1.91546 0.428558 2.14279 0.428558H7.71422L10.7142 3.42856V10.7143Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.28564 0.428558V3.85713H10.7142"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  },
);
