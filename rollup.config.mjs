import typescript from "@rollup/plugin-typescript";
import alias from "rollup-plugin-alias";

export default {
  input: "src/main.ts",
  output: {
    dir: "./dist",
    format: "cjs",
  },
  plugins: [
    typescript(),
    alias({
      "@src": `${__dirname}/src`,
    }),
  ],
};
