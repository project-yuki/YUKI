import { remote } from 'electron'

export function updateWindowHeight (
  component: Vue.default, addBodyHeight: boolean, offset: number) {
  let newHeight = offset
  if (addBodyHeight) newHeight += document.body.offsetHeight
  const window = remote.getCurrentWindow()
  const width = window.getSize()[0]
  if (component) {
    if (newHeight > 640) {
      component.$nextTick(() => {
        component.$store.dispatch('View/setWindowTooHigh', true)
      })
    } else {
      component.$nextTick(() => {
        component.$store.dispatch('View/setWindowTooHigh', false)
      })
    }
  }
  window.setSize(width, newHeight)
  return newHeight
}
