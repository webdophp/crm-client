import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function loadView(view) {
    return () => import(`../views/${view}.vue`);
}

const routes = [
    {
        path: "/",
        redirect: "/topic"
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        meta: {layout: 'main', auth: true},
        component: loadView('Dashboard')
    },
    {
        path: '/notifications',
        name: 'notifications',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Notifications')
    },

    {
        path: '/profile',
        name: 'profile',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Profile')
    },
    {
        path: '/tracking',
        name: 'tracking',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Tracking')
    },
    {
        path: '/company',
        name: 'company',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Company')
    },
    {
        path: '/topic/:uuid/company/edit',
        name: 'company.edit',
        meta: {layout: 'default', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('CompanyEdit')
    },
    {
        path: '/invoice',
        name: 'invoice',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Invoices')
    },
    {
        path: '/topic',
        name: 'topic',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Topics')
    },
    {
        path: '/topic/:uuid',
        name: 'topic.messages',
        meta: {layout: 'default', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('TopicForm')
    },
    {
        path: '/deal',
        name: 'deal',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Deals')
    },
    {
        path: '/deal/:uuid',
        name: 'deal.show',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('DealForm')
    },



    // {
    //     path: '/invite',
    //     name: 'invite',
    //     meta: {layout: 'main', auth: {roles: ['administrator', 'manager']}},
    //     component: loadView('Invites')
    // },
    {
        path: '/storage',
        name: 'storage',
        meta: {layout: 'main', auth: {roles: ['client', 'client_trustee']}},
        component: loadView('Storages')
    },
    {
        path: '/auth/login',
        name: 'login',
        meta: { layout: 'single-page', auth: false },
        component: loadView('Auth/Login')
    },
    {
        path: '/auth/register/:uuid',
        name: 'register',
        meta: {layout: 'single-page', auth: false},
        component: loadView('Auth/Register')
    },
    {
        path: '/auth/clientRegister',
        name: 'clientRegister',
        meta: {layout: 'single-page', auth: false},
        component: loadView('Auth/RegisterClient')
    },
    {
        path: '/auth/forgot',
        name: 'forgot',
        meta: {layout: 'single-page', auth: false},
        component: loadView('Auth/Forgot')
    },
    {
        path: '/auth/forgot/check/:email',
        name: 'reset_password',
        meta: {layout: 'single-page', auth: false},
        component: loadView('Auth/ResetPassword')
    },
    {
        path: '/404',
        name: 'error-404',
        meta: {layout: 'main', auth: true},
        component: loadView('Errors/NotFound')
    },
    {
        path: '/403',
        name: 'error-403',
        meta: {layout: 'main', auth: true},
        component: loadView('Errors/Forbidden')
    },
    {
        path: '/block',
        name: 'block',
        meta: {layout: 'single-page', auth: undefined},
        component: loadView('Errors/Blocked')
    },
    {
        path: '/maintenance',
        name: 'maintenance',
        meta: {layout: 'single-page', auth: undefined},
        component: loadView('Errors/Maintenance')
    },
    {
        path: '*',
        redirect: '/404',
        meta: {layout: 'default', auth: undefined},
    },
];

Vue.router = new VueRouter({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return window.scrollTo({top: 0, behavior: 'smooth'});
    },
    /*
    scrollBehavior: (to, from, savedPosition) => {
        let scrollTo = 0
        if (to.hash) {
            scrollTo = to.hash
        } else if (savedPosition) {
            scrollTo = savedPosition.y
        }
        return window.goTo(scrollTo)
    },
    */
    /*
    scrollBehavior() {
        return window.scrollTo({top: 0, behavior: 'smooth'});
    },
    */
    hashbang: false,
    linkActiveClass: 'active',
    transitionOnLoad: true,
    mode: 'history',
    base: __dirname,
    routes: routes
});

export default Vue.router;
