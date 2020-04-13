import pkg from './package.json'
import rpi_resolve from '@rollup/plugin-node-resolve'
import rpi_jsy from 'rollup-plugin-jsy-lite'
/// import { terser as rpi_terser } from 'rollup-plugin-terser'
//
const pkg_name = (pkg.name || 'private').replace('-', '_')
const plat_default = {generic: true}

const configs = []
export default configs

const sourcemap = true
const external = ['crypto']

const plugins = [
  rpi_resolve({preferBuiltins: true}),
]

const plugins_generic = [
  rpi_jsy({defines: {}}),
  ... plugins ]
const plugins_nodejs = [
  rpi_jsy({defines: {PLAT_NODEJS: true}}),
  ... plugins ]
const plugins_web = [
  rpi_jsy({defines: {PLAT_WEB: true}}),
  ... plugins ]
const plugins_min = null && [
  ... plugins_web,
  rpi_terser({}) ]


add_jsy('index', {module_name: pkg_name})
add_jsy('tahoe', {plat: {node: true, web: true}})
add_jsy('db/hex_utils')
add_jsy('db/js_map')
add_jsy('db/web_db')
add_jsy('db/level')
add_jsy('db/s3')
add_jsy('db/keyv')


function add_jsy(src_name, opt={}) {
  let module_name = opt.module_name || `${pkg_name}_${src_name}`
  const plat = opt.plat || plat_default

  if (plugins_generic && plat.generic)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_generic, external,
      output: [
        { file: `esm/${src_name}.mjs`, format: 'es', sourcemap } ]})

  if (plugins_nodejs && plat.node)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_nodejs, external,
      output: [
        { file: `cjs/${src_name}.cjs`, format: 'cjs', exports:'named', sourcemap },
        { file: `esm/node/${src_name}.mjs`, format: 'es', sourcemap } ]})

  if (plugins_web && plat.web)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_web, external,
      output: [
        { file: `umd/${src_name}.js`, format: 'umd', name:module_name, exports:'named', sourcemap },
        { file: `esm/web/${src_name}.mjs`, format: 'es', sourcemap } ]})

  if (plugins_min && plat.web)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_min, external,
      output: { file: `umd/${src_name}.min.js`, format: 'umd', name:module_name, exports:'named' }})
}
