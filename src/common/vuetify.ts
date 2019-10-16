import '@mdi/font/css/materialdesignicons.css'
import 'vuetify-dialog/dist/vuetify-dialog.min.css'

import Vue from 'vue'
import VuetifyDialog from 'vuetify-dialog'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi'
  }
})

Vue.use(VuetifyDialog, {
  context: {
    vuetify
  }
})

export default vuetify
