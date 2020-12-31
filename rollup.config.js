import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import fileSize from 'rollup-plugin-filesize'
import gzipPlugin from 'rollup-plugin-gzip'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from '@wessberg/rollup-plugin-ts'

import path from 'path'

import pkg from './package.json'

const aliasPlugin = alias({
  entries: Object.entries(pkg.browser).map(([find, replacement]) => ({
    find,
    replacement: replacement.startsWith('.')
      ? path.resolve(__dirname, replacement)
      : path.resolve(__dirname, 'node_modules', replacement),
  })),
})

const commonPlugins = [
  json(),
  terser({ output: { comments: false } }),
  fileSize({ showMinifiedSize: false }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
]

export default [
  {
    input: 'src/browser.ts',
    output: {
      name: 'TwitchJs',
      file: pkg.unpkg,
      format: 'iife',
      exports: 'default',
      sourcemap: true,
    },
    plugins: [
      aliasPlugin,
      resolve({ browser: true, preferBuiltins: true }),
      commonjs(),
      typescript({
        tsconfig: (resolvedConfig) => ({
          ...resolvedConfig,
          declaration: false,
        }),
      }),
      gzipPlugin(),
      ...commonPlugins,
    ],
  },

  {
    input: 'src/index.ts',
    output: [{ file: pkg.module, format: 'es', sourcemap: true }],
    plugins: [
      typescript({
        tsconfig: (resolvedConfig) => ({
          ...resolvedConfig,
          declarationDir: 'types',
        }),
      }),
      ...commonPlugins,
    ],
    external: (id) =>
      Object.keys(pkg.dependencies).some((dep) => id.startsWith(dep)),
  },
]
