<template>
    <v-container class="max_width text-center d-flex justify-content-center">
        <app-sidebar :key="'sidebar' + sidebarKey" :drawer="drawer" @nav-toggle="navToggle" class="sidebar_size"></app-sidebar>
        <v-main>
            <transition >
                <v-container>
                    <app-top-menu-mobile v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )" :drawer="drawer" :scrollY="scrollY" @nav-toggle="navToggle"></app-top-menu-mobile>
                    <app-top-menu v-if="($vuetify.breakpoint.lgOnly || $vuetify.breakpoint.xlOnly || $vuetify.breakpoint.mdOnly)" :drawer="drawer" @nav-toggle="navToggle"></app-top-menu>
                    <router-view  :key="componentKey"></router-view>
                    <app-button-add-topic v-if="this.$route.name !== 'topic.messages'"></app-button-add-topic>
                </v-container>
            </transition>
        </v-main>
    </v-container>
</template>
<script>

import Vue from 'vue'
import mixin from '../../plugins/mixin'

Vue.mixin(mixin)

import Echo from "laravel-echo";
import {getMessaging, getToken} from "firebase/messaging";
import {mapGetters, mapActions} from "vuex"
import AppSidebar from "../../components/AppSidebar"
import AppTopMenuMobile from "../../components/AppTopMenuMobile"
import AppTopMenu from "../../components/AppTopMenu"
import AppButtonAddTopic from "../../components/AppButtonAddTopic"


export default {
    name: "MainLayout",
    components: {
        AppTopMenuMobile,
        AppTopMenu,
        AppSidebar,
        AppButtonAddTopic,
    },
    props: {
        source: String,
        push: Object
    },
    provide: function () {
        return {
            forceRerender: this.forceRerender,
            forceRerenderSidebar: this.forceRerenderSidebar,
            setUserData: this.setUserData,
        }
    },
    data() {
        return {
            scrollY: 0,
            loaded: false,
            drawer: false,
            componentKey: 0,
            sidebarKey: 0,
            friend: null,
            overlay: true,
        }
    },
    computed: {
        ...mapGetters(['lang', 'language', 'defaultAvatar', 'userAvatar', 'userName', 'userLogin', 'userInitials', 'theme', 'countUnreadNotifications']),
    },
    async mounted() {
        this.appName = process.env.VUE_APP_NAME
        this.drawer = this.$vuetify.breakpoint.mdAndUp
        await this.$auth
            .load()
            .then(() => {
                if (this.$auth.check() && this.$auth.user() && this.$auth.user().settings) {
                    this.setSettings(this.$auth.user().settings)
                    this.setUserName(this.$auth.user().name)
                    this.setUserInitials(this.$auth.user().name)
                    this.setUserPosition(this.$auth.user().position)
                    this.setUserAvatar((this.$auth.user().photo ? this.$auth.user().photo : this.defaultAvatar))
                    this.setCountUnreadNotifications((this.$auth.user().countUnreadNotifications ? this.$auth.user().countUnreadNotifications : this.countUnreadNotifications))
                    this.listenChannelWebsocket()
                   // this.listenChannelFCM()

                }
                this.loaded = true
            })
        this.setLang()
    },
    methods: {
        ...mapActions(['setCountUnreadNotifications','setSettings', 'setLanguage', 'setUserName', 'setUserInitials', 'setUserPosition', 'setUserAvatar']),
        onScroll (e) {
            console.log(11)
            this.scrollY = e.target.scrollTop
        },
        setLang() {
            if (this.$auth.check() && this.$auth.user() && this.$auth.user().language) {
                document.documentElement.lang = this.$auth.user().language
                this.setLanguage(this.$auth.user().language)
            }
            if (typeof this.$i18n.locale !== 'undefined') {
                this.$i18n.locale = document.documentElement.lang
            }
            this.$moment.locale(this.$i18n.locale)
            if (typeof this.$vuetify.lang.current !== 'undefined') {
                this.$vuetify.lang.current = document.documentElement.lang
            }
        },
        forceRerender: function () {
            this.componentKey += 1
        },
        forceRerenderSidebar: function () {
            this.sidebarKey += 1
        },
        navToggle() {
            this.drawer = !this.drawer
        },
        checkNotification() {
            var _this = this
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notification");
            } else if (Notification.permission === "granted") {
                console.log("Notification.permission granted");
                // If it's okay let's create a notification
                //var notification = new Notification("Hi there 1!")
                this.listenChannelFCM()
            } else if (Notification.permission !== 'denied' || Notification.permission === "default") {
                Notification.requestPermission(function (permission) {
                    console.log("User accepts, let's create a notification");
                    // If the user accepts, let's create a notification
                    if (permission === "granted") {
                        //var notification = new Notification("Hi there 2!")
                        _this.listenChannelFCM()
                    }
                })
            }
        },
        listenChannelFCM() {
            const messaging = getMessaging();
            getToken(messaging, {vapidKey: process.env.VUE_APP_FCM_VAPID_KEY})
                .then((token) => {
                    if (token) {
                        // Send the token to your server and update the UI if necessary
                        //console.log('Send the token to your server ', token);
                        console.log('Send the token to your server');
                        this.saveNotificationToken(token)
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                })
                .catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });
        },
        saveNotificationToken(token) {
            const params = {
                token: token,
                type: 'browser'
            }
            this.$http
                .post("client/device", params)
                .then((res) => {
                    console.log('Successfully saved notification token!')
                })
                .catch((err) => {
                    console.log('Error: could not save notification token')
                })
        },
        listenChannelWebsocket() {
            window.Echo = new Echo({
                broadcaster: "pusher",
                key: process.env.VUE_APP_PUSHER_APP_KEY,
                cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
                disableStats: true,
                encrypted: true,
                enabledTransports: ["wss", "ws"],
                //wsHost: window.location.hostname,
                wsHost: this.$pusherServer,
                authorizer: (channel, options) => {
                    return {
                        authorize: (socketId, callback) => {
                            this.$http.post(`https://${this.$pusherServer}/api/broadcasting/auth`, {
                                socket_id: socketId,
                                channel_name: channel.name
                            })
                                .then(response => {
                                    callback(false, response.data)
                                })
                                .catch(error => {
                                    callback(true, error)
                                })
                        }
                    }
                }
            })

            window.Echo
                .private(`App.Models.Client.${this.$auth.user().id}`)
                .listen('.Event.Client', (event) => {
                    console.log('MainLayout Event.Client')
                    if (event.type.indexOf('notify') !== -1) {
                        this.$toastr.success(`${event.title} ${event.message}`)
                    }
                })
            /*
            .notification((notify) => {
                //console.log('MainLayout notify')
                console.log(notify)
                if (notify.type.indexOf('broadcast.message') !== -1) {
                    this.$toastr.success(`${notify.title} ${notify.message}`)
                }
            })
           */
        },
        setUserData() {
            this.setSettings(this.$auth.user().settings)
            this.setUserName(this.$auth.user().name)
            this.setUserInitials(this.$auth.user().name)
            this.setLanguage(this.$auth.user().language)
            this.setUserAvatar(this.$auth.user().avatar)
            this.setCountUnreadNotifications(this.$auth.user().countUnreadNotifications)

            //this.checkNotification()
            this.listenChannelWebsocket()
        },
    }
}
</script>

<style scoped>


@media screen and (min-width: 960px) {
    .body_width{
        max-width: 650px !important;
    }
}

@media screen and (min-width: 1000px) {
    .body_width{
        max-width: 700px !important;
    }
}

@media screen and (min-width: 1100px) {
    .body_width{
        max-width: 800px !important;
    }
}
@media screen and (min-width: 1904px) {
    .body_width{
        max-width: 100% !important;
    }
}

</style>
