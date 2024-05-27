import baseConfig, { restrictEnvAccess } from "@aura/eslint-config/base";
import nextjsConfig from "@aura/eslint-config/nextjs";
import reactConfig from "@aura/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
