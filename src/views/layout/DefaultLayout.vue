<template>
    <v-main>
        <transition name="fade" mode="out-in">
            <router-view :key="componentKey"></router-view>
        </transition>
    </v-main>
</template>
<script>

import Vue from 'vue'
import mixin from '../../plugins/mixin'

Vue.mixin(mixin)

import Echo from "laravel-echo";
import {mapActions, mapGetters} from "vuex";


export default {
        name: "default-layout",
        props: {
            source: String,
            push: Object
        },
        provide: function () {
            return {
                setUserData: this.setUserData,
            }
        },
        data() {
            return {
                loaded: false,
                drawer: false,
                componentKey: 0,
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

                        this.listenChannelWebsocket();
                    }
                    this.loaded = true
                })
            this.setLang()
        },
        methods: {
            ...mapActions(['setCountUnreadNotifications','setSettings', 'setLanguage', 'setUserName', 'setUserInitials', 'setUserPosition', 'setUserAvatar']),
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
