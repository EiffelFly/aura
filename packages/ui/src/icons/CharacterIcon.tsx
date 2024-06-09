import * as React from "react";

import { IconProps } from "./type";

export const CharacterIcon = React.forwardRef<SVGSVGElement, IconProps>(
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
          d="M4.28568 5.57185C5.46914 5.57185 6.42854 4.61246 6.42854 3.42899C6.42854 2.24552 5.46914 1.28613 4.28568 1.28613C3.10221 1.28613 2.14282 2.24552 2.14282 3.42899C2.14282 4.61246 3.10221 5.57185 4.28568 5.57185Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.428467 11.5722H4.28561H8.14275V11.1076C8.13593 10.4543 7.96363 9.81328 7.64195 9.24466C7.32026 8.67594 6.85969 8.19808 6.30326 7.85566C5.74682 7.51324 5.11267 7.31744 4.46005 7.28654C4.40187 7.28379 4.34371 7.28235 4.28561 7.28223C4.22751 7.28235 4.16935 7.28379 4.11116 7.28654C3.45854 7.31744 2.8244 7.51324 2.26796 7.85566C1.71152 8.19808 1.25096 8.67594 0.92927 9.24466C0.60759 9.81328 0.435291 10.4543 0.428467 11.1076V11.5722Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.71411 5.57185C8.89757 5.57185 9.85697 4.61246 9.85697 3.42899C9.85697 2.24552 8.89757 1.28613 7.71411 1.28613"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.857 11.5718H11.5713V11.1071C11.5644 10.4538 11.3921 9.8128 11.0705 9.24417C10.7488 8.67545 10.2882 8.19761 9.73177 7.85519C9.37212 7.63384 8.97989 7.47376 8.57129 7.37988"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  },
);
