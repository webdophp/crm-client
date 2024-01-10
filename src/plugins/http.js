import Vue from 'vue';

// Vue Resource
import VueResource from 'vue-resource';

Vue.use(VueResource);

Vue.http.options.credentials = true;
Vue.http.options.emulateHTTP = true
Vue.http.options.root = process.env.VUE_APP_API_URL + '/api/v1/';
Vue.http.headers.common['Accept'] = "application/json"
Vue.http.headers.common['Content-Type'] = "application/json"

Vue.http.interceptors.push((request, next) => {
    request.headers.set('Accept-Language', document.documentElement.lang);
    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers.set('X-HTTP-Method-Override', request.method);
        request.method = 'POST';
    }
    next(function (response) {
        if (response.status === 401) {
            Vue.auth.logout({redirect: 'login', makeRequest: false})
        } else if (response.status === 403) {
            Vue.router.push('/forbidden')
        } else if (response.status === 404) {
            Vue.router.push('/notfound')
        /*
        } else if (response.status === 500) {
            if (Vue.$auth.check()) {
                Vue.auth.logout({redirect: '/maintenance', makeRequest: false,})
            } else {
                Vue.router.push('/maintenance')
            }
        */
        } else if (response.status === 503) {
            if (Vue.$auth.check()) {
                Vue.auth.logout({redirect: '/maintenance', makeRequest: false,})
            } else {
                Vue.router.push('/maintenance')
            }
        }
    })
})


/*
// Axios
import axios from 'axios';
import VueAxios from 'vue-axios';

axios.defaults.baseURL = process.env.VUE_APP_API_URL + '/api/v1/';

Vue.axios.interceptors.request.use(config => {
    config.headers.common['Language'] = document.documentElement.lang;
    if (/^(PUT|PATCH|DELETE)$/i.test(config.method)) {
        config.headers.common['X-HTTP-Method-Override'] = config.method;
        config.method = 'POST';
    }
    return config;
});

Vue.axios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        Vue.auth.logout({redirect: 'login', makeRequest: false})
    } else if (error.response.status === 403) {
        Vue.router.push('/forbidden')
    } else if (error.response.status === 404) {
        Vue.router.push('/notfound')
    } else if (error.response.status === 500) {
        if (Vue.$auth.check()) {
            Vue.auth.logout({redirect: '/maintenance', makeRequest: false,})
        } else {
            Vue.router.push('/maintenance')
        }
    } else if (error.response.status === 503) {
        if (Vue.$auth.check()) {
            Vue.auth.logout({redirect: '/maintenance', makeRequest: false,})
        } else {
            Vue.router.push('/maintenance')
        }
    }
    return Promise.reject(error)
});

Vue.use(VueAxios, axios);
*/

export default {
    root: process.env.VUE_APP_API_URL
};
