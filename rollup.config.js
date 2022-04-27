// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
    input: "./src/index.ts",
    output: {
        format: "iife",
        file: "./build/bundle.js"
    },
    plugins: [
        typescript({
            tsconfig: "./tsconfig.json",
            noEmitOnError: true
        })
    ]
};