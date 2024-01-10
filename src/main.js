import Vue from "vue"

import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

import i18n from './plugins/i18n'
import http from './plugins/http'
import store from './plugins/store'
import router from './plugins/router'
import auth from './plugins/auth'
import vuetify from './plugins/vuetify'
import VueObserveVisibility from "vue-observe-visibility";
import {Tree} from "element-ui"
import App from "./App.vue"

import './plugins/tinymce'
import './plugins/pusher'
import './plugins/prototype'
import './plugins/vee-validate'
import './registerServiceWorker'
//import './plugins/firebase'
import './plugins/toastr'
import VueTour from 'vue-tour'

Vue.config.productionTip = false

Vue.use(VueObserveVisibility);

moment.locale(i18n.locale)
moment.defaultFormat = "YYYY-MM-DD HH:mm:ss"
Vue.use(VueMoment, {
    moment,
})

Vue.component(Tree.name, Tree)
Vue.prototype.$yandex = {
    apiKey: process.env.VUE_APP_YANDEX_MAP_KEY,
    lang: "ru_RU",
    coordorder: "latlong",
    version: "2.1"
}

Vue.prototype.$google = {
    maps_key: process.env.VUE_APP_GOOGLE_MAP_KEY
}

Vue.prototype.$pusherServer = process.env.VUE_APP_PUSH_SERVER

import vScroll from 'vue-scroll'
Vue.use(vScroll)

require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)


import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo, {
    container: 'body',
    lazy: true,
    easing: 'ease',
    offset: -100,
    force: true,
    cancelable: true,
    onStart: false,
    onDone: false,
    onCancel: false,
    x: false,
    y: true,
})


new Vue({
    i18n: i18n,
    http: http,
    store: store,
    router: router,
    config: auth,
    vuetify: vuetify,
    VueScrollTo: VueScrollTo,
    directives: {
        'v-scroll': vScroll,  // tried 'vScroll': vScroll as well
    },
    render: h => h(App)
}).$mount("#app")
