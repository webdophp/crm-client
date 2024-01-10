import Vue from 'vue';

window.toastr = require("toastr")
import VueToastr2 from 'vue-toastr-2'

import "vue-toastr-2/dist/vue-toastr-2.min.css"

Vue.use(VueToastr2, {
    debug: false,
    closeButton: true,
    extendedTimeOut: 500,
    timeOut: 3000,
    progressBar: false,
    preventDuplicates: true,
    onclick: null,
    positionClass: "toast-bottom-right"
})

export default {}
