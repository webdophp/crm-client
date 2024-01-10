<!--
https://ru.stackoverflow.com/questions/1273957/%D0%9F%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B5-%D0%BF%D0%BE%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%B0
-->
<template>

    <v-hover v-slot="{ hover }">
    <!--Это нужно вставить ниже если хотим чтоб открывалось скрывалось меню :expand-on-hover="!($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)"-->
    <v-navigation-drawer floating  v-model="drawerShow"
                         mini-variant.sync="true"
                         mini-variant-width="80"
                         :width="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '40%' : '180'"
                         :permanent="!($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )"
                         :class="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float-left ml-5'"
                         mobile-breakpoint="960"  height="100%" :app="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )">
      <!--
        <v-list class="py-0" dark color="#F3F5F9" >
            <v-list-item v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)">
                <v-list-item-content class="align-left">
                    <v-img src="/img/logo.svg" max-height="50px" contain ></v-img>
                </v-list-item-content>
            </v-list-item>
            <v-list-item v-else class="mt-5">
                <v-list-item-content v-if="false">
                    <v-img src="/img/logoMin.svg" max-height="50px" contain></v-img>
                </v-list-item-content>
                <v-list-item-content class="align-left" v-else>
                    <v-img src="/img/logo.svg" max-height="50px" contain ></v-img>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        -->

        <scrollbar ref="scrollbar"  :swicher="!$vuetify.breakpoint.smAndDown"
                   :settings="settingsScrollbar" class="inner-scrollbar" >

            <v-list  flat class="py-0 my-0 pt-2">
                <v-list-item-group

                    color="primary"
                >

                     <v-list-item

                         v-for="item in items[0]"
                         v-show="item.visible"
                                  @click.native="item.action ? item.action() : false"
                                  href="javascript:void(0)"
                                  :to="item.to" ripple
                                  :exact="item.exact !== undefined ? item.exact : true"
                                  :key="item.title"

                                  class="rounded-lg my-0 py-0 px-1 mx-1 v-list-item" color="primary">

                        <v-list-item-icon class="pt-0 py-0 my-0 mr-0 pr-3">


                            <v-badge
                                v-if="parseInt(item.badge) > 0"
                                overlap
                                bordered
                                :content="item.badge"

                            >
                                <v-icon :color="$route.name === item.route ? '#007EC9' : '#000000'"
                                        class="py-1 my-1 icon_width">
                                    ${{item.icon}}
                                </v-icon>
                            </v-badge>
                            <v-icon v-else

                                    :color="$route.name === item.route ? '#007EC9' : '#000000'"
                                    class="py-1 my-1 icon_width">
                                ${{item.icon}}
                            </v-icon>
                        </v-list-item-icon>
                         <v-list-item-content class="mx-0 px-0">
                             <v-list-item-title class="menu-text" :style="$route.name === item.route ? 'color: #007EC9;' : 'color: #000000;'" :class="setClass(hover)" v-text="$t(item.title)" ></v-list-item-title>
                             <!--<v-list-item-title  class="mx-0 px-0 menu-text" :style="$route.name === item.route ? 'color: #007EC9;' : 'color: #000000;'"  v-text="$t(item.title)"></v-list-item-title>-->
                         </v-list-item-content>


                        <!--
                         <v-btn
                             class="rounded-lg"
                             depressed
                             :plain="!item.action ? true : false"
                             tile
                             color="#265898"
                             dark
                             style="text-transform: math-auto;"
                             @click.native="item.action ? item.action() : false"
                         >
                             <v-icon left>
                                 ${{item.icon}}
                             </v-icon>
                             {{$t(item.title)}}
                         </v-btn>-->

                     </v-list-item>



                </v-list-item-group>
            </v-list>



        </scrollbar>
        <div style="position: fixed; bottom: 30px; left: 105px;" v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )">
            <v-img src="/img/logo.svg" width="88px"></v-img>
        </div>
    </v-navigation-drawer>

    </v-hover>

</template>
<script>

import Scrollbar from './Scrollbar'
import {mapGetters} from "vuex";

export default {
    name: "AppSidebarOLD",
    components: {
        Scrollbar,
    },
    inject: ['forceRerender'],
    props: {
        drawer: Boolean
    },
    data() {
        return {
            text_transform: 'text_transform',
            isMini: null,
            selectedItem: 1,
            items: [],
            settingsScrollbar: {
                suppressScrollX: true,
            },
            mini: false,
        }
    },
    computed: {
        ...mapGetters(['countUnreadNotifications']),
        drawerShow: {
            get: function () {
                return this.drawer
            },
            set: function (state) {
                if (state !== this.drawer) {
                    this.navToggle()
                }
            }
        },
        routePath() {
            return this.$route.path
        },
    },
    watch: {

        routePath(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.navigation()
            }
        },
        mini(val) {
            if (this.$vuetify.breakpoint.smAndDown || !this.drawer) {
                this.mini = false
            } else {
                this.mini = (this.$vuetify.breakpoint.smAndUp && val)
            }
        },
    },
    mounted() {
        this.navigation()
    },
    methods: {


        setClass(hover){
            if(this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smOnly){
                return ''
            }
            else{
                if(hover === true){
                    return 'text_transform2'
                }
                else{
                    return 'text_transform'
                }
            }

        },
        navToggle() {
            this.$emit("nav-toggle")
        },
        navigation() {
            this.items = [
                [
                    /*
                      {
                        title: 'menu_home',
                        icon: 'homeIcon',
                        to: {name: "dashboard"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    */

                    {
                        badge: 0,
                        title: 'menu_messages',
                        icon: "messagesIcon",
                       // icon: "mdi-comment-text-outline mdi-24px",
                        to: {name: "topic"},
                        route: "topic",
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    {
                        badge: 0,
                        title: 'menu_deals',
                        icon: 'dealIcon',
                        //icon: 'mdi-go-kart-track mdi-24px',
                        route: "deal",
                        to: {name: "deal"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    {
                        badge: 0,
                        title: 'menu_tracking',
                        icon: 'TrackingIcon',
                        //icon: 'mdi-go-kart-track mdi-24px',
                        route: "tracking",
                        to: {name: "tracking"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    {
                        badge: 0,
                        title: 'menu_payments',
                       // icon: 'mdi-cash mdi-24px',
                        icon: 'invoicesIcon',
                        route: "invoice",
                        to: {name: "invoice"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },


                    {
                        badge: 0,
                        title: 'menu_company',
                        //icon: "mdi-home-flood mdi-24px",
                        icon: "companyIcon",
                        route: "company",
                        to: {name: "company"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    {
                        badge: 0,
                        title: 'menu_storage',
                      //  icon: "mdi-file-document-outline mdi-24px",
                        icon: "StoragesIcon",
                        route: "storage",
                        to: {name: "storage"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    {
                        badge: this.countUnreadNotifications,
                        title: 'notifications',
                        icon: "NotificationsIcon",
                       // icon: "mdi-bell mdi-24px",
                        route: "notifications",
                        to: {name: "notifications"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    {
                        badge: 0,
                        title: 'profile',
                        icon: "settingsIcon",
                       // icon: "mdi-account mdi-24px",
                        route: "profile",
                        to: {name: "profile"},
                        action: this.forceRerender,
                        visible: this.$auth.check(),
                        exact: false
                    },
                    {
                        badge: 0,
                        title: 'logout',
                        icon: "LogoutIcon",
                       // icon: "mdi-logout-variant mdi-24px",
                        route: "logout",
                        visible: this.$auth.check(),
                        action: this.logout
                    }

                ]
            ]
        },
        async logout() {
            await this.$auth
                .logout({
                    makeRequest: true,
                    redirect: {
                        name: "login"
                    }
                })
                .then(res => {
                    this.$toastr.success(this.$t('you_have_successfully_logged_out'))
                })
                .catch(err => {
                    this.$toastr.error(this.$t('error_occurred_while_exiting'))
                })
        },
    }
}
</script>

<style scoped>
.menu-text{
    font-size: 11px !important;
    font-weight: 400;
    color: #000;
}
.v-list-item{
    min-height: 42px;
}
</style>
