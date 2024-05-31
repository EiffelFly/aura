import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@aura/tailwind-config/web";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  plugins: [typography],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      typography: {
        xl: {
          css: {
            ol: {
              listStyleType: "decimal",
              listStylePosition: "inside",
            },

            "ul > li::before": {
              content: '"-"',
              marginRight: "1rem",
            },

            // "h1 > span::before": {
            //   content: "'#'",
            //   marginRight: "0.1rem",
            // },

            // "h2 > span::before": {
            //   content: "'##'",
            //   marginRight: "0.1rem",
            // },
          },
        },
      },
    },
  },
} satisfies Config;
