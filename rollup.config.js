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
  entries: [
    {
      find: 'form-data',
      replacement: path.resolve(__dirname, 'shims/form-data.js'),
    },
    {
      find: 'node-fetch',
      replacement: path.resolve(__dirname, 'shims/node-fetch.js'),
    },
    { find: 'ws', replacement: path.resolve(__dirname, 'shims/ws.js') },
  ],
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
