import Vue from 'vue'

import auth                  from '@websanova/vue-auth/src/v2.js';
//import driverAuthBearer      from '@websanova/vue-auth/src/drivers/auth/bearer.js';
import driverAuthBearer      from './bearer';
//import driverHttpAxios       from '@websanova/vue-auth/src/drivers/http/axios.1.x.js';
import driverHttpVueResource from '@websanova/vue-auth/src/drivers/http/vue-resource.1.x.js';
import driverRouterVueRouter from '@websanova/vue-auth/src/drivers/router/vue-router.2.x.js';
import driverOAuth2Google    from '@websanova/vue-auth/src/drivers/oauth2/google.js';
import driverOAuth2Facebook  from '@websanova/vue-auth/src/drivers/oauth2/facebook.js';

driverOAuth2Google.params.client_id = process.env.VUE_APP_OAUTH2GOOGLE;
driverOAuth2Facebook.params.client_id = process.env.VUE_APP_OAUTH2FASEBOOK;

Vue.use(auth, {
    plugins: {
        //http: Vue.axios, // Axios
        http: Vue.http, // Vue Resource
        router: Vue.router,
    },
    drivers: {
        auth: driverAuthBearer,
        //http: driverHttpAxios, // Axios
        http: driverHttpVueResource, // Vue Resource
        router: driverRouterVueRouter,
        oauth2: {
            google: driverOAuth2Google,
            facebook: driverOAuth2Facebook,
        }
    },
    options: {
        tokenDefaultKey: 'authToken',
        stores: ['storage'],
        //rolesVar: 'roles',
        //rolesKey: 'type',
        rolesKey: 'roles',
        authRedirect: {name: 'login'},
        forbiddenRedirect: {name: 'error-403'},
        notFoundRedirect: {name: 'error-404'},
        registerData: {
            url: 'auth/client/register',
            method: 'POST',
            redirect: '/topic',
            enabled: false,
        },
        loginData: {
            url: 'auth/client/login',
            method: 'POST',
            redirect: '/topic',
            fetchUser: true,
            staySignedIn: true
        },
        logoutData: {
            url: 'auth/client/logout',
            method: 'POST',
            redirect: '/auth/login',
            makeRequest: true,
        },
        fetchData: {
            url: 'auth/client/user',
            method: 'POST',
            enabled: true,
        },
        refreshData: {
            url: 'auth/client/refresh',
            headers: {'Cache-Control': 'no-cache, no-store'},
            method: 'POST',
            enabled: true,
            interval: 1,
        }
    }
});

export default {};
