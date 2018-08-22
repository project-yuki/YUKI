/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = (<any>require).context('.', false, /\.ts$/)
const modules = {}

files.keys().forEach((key: string) => {
  if (key === './index.ts') return
  modules[key.replace(/(\.\/|\.ts)/g, '')] = files(key).default
  modules[key.replace(/(\.\/|\.ts)/g, '')].namespaced = true
})

export default modules
