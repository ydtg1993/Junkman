import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import less from 'rollup-plugin-less';

export default {
    input: './src/index.ts',
    output: {
        file: 'dist/junkman.js',
        name: 'junkman',
        format: 'iife',
        minifyInternalExports: true
    },
    plugins: [resolve(), typescript(),less()]
};