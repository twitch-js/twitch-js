import resolve from 'rollup-plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
import gzipPlugin from 'rollup-plugin-gzip'

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
  typescript(),
  terser(),
  filesize({ showMinifiedSize: false }),
]

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'TwitchJS',
      file: 'dist/twitch-js.umd.js',
      format: 'umd',
      exports: 'named',
      sourcemap: true,
    },
    plugins: [
      aliasPlugin,
      resolve(),
      commonjs(),
      gzipPlugin(),
      ...commonPlugins,
    ],
  },

  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true },
      { file: pkg.module, format: 'es', exports: 'named', sourcemap: true },
    ],
    plugins: [...commonPlugins],
    external: id =>
      Object.keys(pkg.dependencies).some(dep => id.startsWith(dep)),
  },
]
