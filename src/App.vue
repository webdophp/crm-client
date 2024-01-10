<template>
    <v-app>
        <component :is="layout" v-if="$auth.ready()">
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </component>
        <v-overlay v-if="!$auth.ready()">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
    </v-app>
</template>

<script>

    const default_layout = "default"

    import DefaultLayout from "./views/layout/DefaultLayout.vue"
    import MainLayout from "./views/layout/MainLayout.vue"
    import SinglePageLayout from "./views/layout/SinglePageLayout.vue"

    export default {
        name: "App",

        components: {
            "default-layout": DefaultLayout,
            "main-layout": MainLayout,
            "single-page-layout": SinglePageLayout
        },
        data() {
            return {
                globalMessage: null
            }
        },
        computed: {
            layout() {
                return (this.$route.meta.layout || default_layout) + "-layout"
            }
        }
    }
</script>
