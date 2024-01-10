<template>
    <v-app-bar v-if="this.$route.name !== 'topic.messages'"
        :fixed="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly || $vuetify.breakpoint.mdOnly)"  app
        class="mt-0 pb-0 mb-0 px-4"
        :elevation=" scrollY > 0 ? 16 : 0"
        color="#fff"
    >

        <v-app-bar-nav-icon @click.stop="navToggle">
            <v-icon size="40" color="#1C1B1F" class="ml-1">${{'notificationIcon'}}</v-icon>
        </v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-app-bar-title><v-img src="/img/logo-mini.svg" width="40px" style="display: block; "></v-img></v-app-bar-title>
    </v-app-bar>

</template>
<script>

import {mapGetters} from "vuex"

export default {
    name: "AppTopMenuMobile",
    inject: [
        'forceRerender',
        'setUserData'
    ],
    props: {
        drawer: Boolean,
        scrollY: Number,
    },
    data() {
        return {
            delete_param: true,

        }
    },
    computed: {
        ...mapGetters(['lang', 'userCompany','userName','userAvatar']),
    },
    methods: {
        navToggle() {
            this.$emit("nav-toggle")
        },
    }
}
</script>

