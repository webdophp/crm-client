<template>
    <v-hover v-slot="{ hover }">
    <v-navigation-drawer floating v-model="drawerShow"
                         mini-variant.sync="true"
                         mini-variant-width="80"
                         :permanent="!($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )"
                         :class="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'ml-5'"
                         mobile-breakpoint="960"  height="100%" :app="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )">





        <scrollbar ref="scrollbar"  :swicher="!$vuetify.breakpoint.smAndDown"
                   :settings="settingsScrollbar" class="inner-scrollbar" >


            <div class="tab_close"  v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )">
                <v-btn
                    icon
                    @click="close"
                >
                    <v-img  src="/img/tabClose.svg" ></v-img>
                </v-btn>

            </div>

            <v-list  nav flat class="pt-2">





                <v-list-item color="primary" class="pt-11 pl-9" v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )">

                    <v-list-item-avatar size="47" class="border1 mr-3" >
                        <img v-if="userAvatar !== '/img/avatar.png'" :src="userAvatar" :alt="userName">
                        <v-icon v-else class="font-primary" size="24">
                            ${{'settingsIcon'}}
                        </v-icon>

                    </v-list-item-avatar>
                    <v-list-item-subtitle class="tab_menu_name">{{userName}}</v-list-item-subtitle>
                </v-list-item>
                <div class="user_language" v-if="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly )">RUS</div>
                <v-list-item-group color="primary" class="pt-11">

                     <v-list-item

                         v-for="item in items[0]"
                         v-show="item.visible"
                                  @click.native="item.action ? item.action() : false"
                                  href="javascript:void(0)"
                                  :to="item.to" ripple
                                  :exact="item.exact !== undefined ? item.exact : true"
                                  :key="item.title"

                                  class="menu_list_item align-left" >

                        <v-list-item-icon class="mx-0 px-0 pb-0 mb-0 mt-1 pt-1 pr-3">
                            <v-badge
                                v-if="parseInt(item.badge) > 0"
                                overlap
                                bordered
                                :content="item.badge"

                            >
                                <v-icon :color="$route.name === item.route ? '#007EC9' : '#000000'"
                                        class="py-0 my-0 icon_width">
                                    ${{item.icon}}
                                </v-icon>
                            </v-badge>
                            <v-icon v-else
                                    :color="$route.name === item.route ? '#007EC9' : '#000000'"
                                    class="py-0 my-0 icon_width">
                                ${{item.icon}}
                            </v-icon>
                        </v-list-item-icon>
                         <v-list-item-content class="mx-0 px-0 my-0 py-0">
                             <v-list-item-title class="menu-text" :style="$route.name === item.route ? 'color: #007EC9;' : 'color: #000000;'" :class="setClass(hover)" v-text="$t(item.title)" ></v-list-item-title>
                          </v-list-item-content>



                     </v-list-item>



                </v-list-item-group>
            </v-list>


        </scrollbar>
    </v-navigation-drawer>

    </v-hover>
</template>
<script>

import Scrollbar from './Scrollbar'
import {mapGetters} from "vuex";

export default {
    name: "AppSidebar",
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
        ...mapGetters(['countUnreadNotifications', 'userName','userAvatar']),
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

        close(){
            this.drawerShow=false
        },

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


</style>
