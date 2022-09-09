import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import scss from 'rollup-plugin-scss';
const eslint = require('rollup-plugin-eslint').eslint;
const babel = require('rollup-plugin-babel');
import pkg from './package.json';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
export default {
  input: 'lib/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    copy({
      targets: [
        {
          src: 'lib/index.scss',
          dest: 'dist/',
        },
      ],
    }),
    scss({
      output: true,
      include: ['/**/*.css', '/**/*.scss', '/**/*.sass'],
      verbose: true,
    }),
    strip(),
    external(),
    resolve(),
    eslint(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    babel({ exclude: 'node_modules/**' }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['isFragment', 'isMemo'],
      },
    }),
    // dts(),
  ],
  watch: {
    include: 'lib/**',
    exclude: 'node_modules/**',
  },
};
