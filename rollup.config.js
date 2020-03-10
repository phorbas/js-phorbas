import pkg from './package.json'
import rpi_resolve from '@rollup/plugin-node-resolve'
import rpi_jsy from 'rollup-plugin-jsy-lite'
const pkg_name = (pkg.name || 'private').replace('-', '_')

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


// Allow Minification -- https://github.com/TrySound/rollup-plugin-terser
/// import { terser as rpi_terser } from 'rollup-plugin-terser'
/// const plugins_min = plugins_web.concat([ rpi_terser({}) ])


add_jsy('index', {module_name: pkg_name})
add_jsy('store/js_map')
add_jsy('store/web_indexdb')


function add_jsy(src_name, opt={}) {
  let module_name = opt.module_name || `${pkg_name}_${src_name}`

  if (plugins_generic)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_generic, external,
      output: [
        { file: `esm/${src_name}.mjs`, format: 'es', sourcemap } ]})

  if (plugins_nodejs)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_nodejs, external,
      output: [
        { file: `cjs/${src_name}.cjs`, format: 'cjs', exports:'named', sourcemap },
        { file: `esm/node/${src_name}.mjs`, format: 'es', sourcemap } ]})

  if (plugins_web)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_web, external,
      output: [
        { file: `umd/${src_name}.js`, format: 'umd', name:module_name, exports:'named', sourcemap },
        { file: `esm/web/${src_name}.js`, format: 'es', sourcemap } ]})

  if ('undefined' !== typeof plugins_min && plugins_min)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_min, external,
      output: { file: `umd/${src_name}.min.js`, format: 'umd', name:module_name, exports:'named' }})
}
