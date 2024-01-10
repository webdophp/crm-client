<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" sm="6" class="px-0 mx-0 title_header notification_header_50" style="width: 50%">
                {{ $t('notifications') }}
            </v-col>
            <v-col cols="12" sm="6" style="width: 50%"
                    class="notification_text notification_header_50 text-right mt-1"
            >
               <span @click="getDevices" class="cursor-pointer" style="cursor: pointer" id="v-step-0">
                    <v-icon left small>
                        mdi-monitor
                    </v-icon>
                    <span v-if="!$vuetify.breakpoint.xsOnly">{{ $t('devices') }}</span>
                </span>
               <span id="v-step-1" @click="readNotifications" class="ml-5 bold"  :style="this.countUnreadNotifications > 0 ? 'font-weight: 500;cursor: pointer' : 'cursor: pointer'">
                    <span v-if="!$vuetify.breakpoint.xsOnly">{{ $t('mark_as_read') }}</span>
                    <v-icon right  small style="font-weight: 500;" class="bold"  >
                        mdi-check-all
                    </v-icon>
               </span>
            </v-col>
        </v-row>

        <v-row dense v-if="!no_data">
            <v-col cols="12" class="px-0 mx-0">
                <v-card flat class="px-0 mx-0 background_color_transparent">
                    <v-card-text class="py-0 my-0 px-0 mx-0">
                         <v-row>
                            <v-col cols="12">
                                <v-list three-line class="background_color_transparent">
                                    <template v-for="(item, index) in notificationItems">
                                        <v-list-item
                                            :key="item.uuid"
                                            class="cursor-pointer mx-0 px-0 mb-5 rowNotification rounded-lg"
                                            @click="notificationClick(item)"
                                        >
                                            <v-list-item-avatar :size="$vuetify.breakpoint.xsOnly ? 55 : 45" class="py-2 my-4 mx-5"
                                            :class="(item.read ? 'border1_B3B3B3' : 'border1')"
                                            >
                                                <v-icon :color="(item.read ? 'color_B3B3B3' : 'primary')" size="18" v-if="item.type === 'tracking_updates'">
                                                    ${{'TrackingIcon'}}
                                                </v-icon>
                                                <v-icon :color="(item.read ? 'color_B3B3B3' : 'primary')" size="22" v-else-if="item.type === 'profile'">
                                                    ${{'settingsIcon'}}
                                                </v-icon>
                                                <v-icon :color="(item.read ? 'color_B3B3B3' : 'primary')" size="22" v-else>
                                                    mdi-card-text
                                                </v-icon>
                                            </v-list-item-avatar>
                                            <v-list-item-content class="py-2 my-0 pb-4">
                                                <v-row>
                                                    <v-col cols="12" sm="8" md="8"  lg="8" xl="6" class="padding_top10_bottom0">
                                                        <v-list-item-title class="notification_title" v-html="item.title"></v-list-item-title>
                                                        <v-list-item-subtitle class="notification_text" v-html="item.message"></v-list-item-subtitle>
                                                    </v-col>
                                                    <v-col cols="12" sm="4" md="4" lg="4" xl="6" v-if="!$vuetify.breakpoint.xsOnly">
                                                        <v-list-item-title class="notification_text" v-html="$t('date')"></v-list-item-title>
                                                        <v-list-item-subtitle class="notification_title" v-html="item.date"></v-list-item-subtitle>

                                                    </v-col>
                                                </v-row>
                                            </v-list-item-content>
                                            <v-list-item-action >
                                                <v-icon class="pt-2 mt-2 mr-4" :color="(item.read ? 'grey' : 'primary')" >
                                                    ${{'chevronRightIcon'}}
                                                </v-icon>
                                            </v-list-item-action>
                                        </v-list-item>
                                    </template>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-center" v-if="(nextLink===true && loading===false) ? true : false">
                    <v-btn
                        color="primary"
                        outlined
                        class="elevation-0 "
                        @click="nextItems"
                    >
                        {{  $t('download_more') }}
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="no_data">
            <v-col cols="12">
                <v-card flat class="background_color_transparent">
                    <v-list-item-content>
                        <v-img style="margin: 0 auto 0 auto" max-width="500" src="img/no/dashboard.png"></v-img>
                    </v-list-item-content>
                </v-card>
            </v-col>
        </v-row>

        <v-sheet v-if="loading && notificationItems.length === 0"
                 color="white lighten-5"
                 class="pa-1"
        >
            <v-skeleton-loader
                class="mx-auto"
                type="text,text,card,text,text,card,text,text"
            ></v-skeleton-loader>
        </v-sheet>


        <v-dialog

            v-model="dialog_device"
            scrollable

            max-width="540px"


        >
            <v-card>
                <v-card-title class="px-2 mx-0 text-right">
                    <v-icon @click="dialog_device = false;" left>mdi-close-circle</v-icon>
                    {{ $t('tethered_devices') }}

                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="my-5">
                    <v-row>
                        <v-col cols="12" class="text-justify">
                            {{ $t('tethered_devices_text') }}
                        </v-col>
                    </v-row>
                    <v-list two-line>

                    <v-list-item
                        v-for="(device, i) in devices"
                        :key="device.id"
                        :class="(i === 0 ? 'rounded-xl rounded-b-0' : (i === devices.length -1 ? 'rounded-xl rounded-t-0' : ''))"
                        class="py-3 my-0 topic_background"
                    >


                        <v-list-item-content v-text="device.user_agent">



                        </v-list-item-content>

                        <v-list-item-action>
                            <v-btn icon @click="deleteDevice(device)">
                                <v-icon color="grey lighten-1">mdi-delete</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>


                    </v-list>
                    <v-btn :x-small="($vuetify.breakpoint.xsOnly)"
                           block
                           rounded
                           class="mt-5"
                           color="primary"
                           @click="checkNotification"
                    >
                    {{ $t('receive_notifications_on_device') }}
                    </v-btn>
                </v-card-text>



            </v-card>
        </v-dialog>



        <v-overlay :value="loading" z-index="10" color="#244ba8">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <v-tour name="TourNotifications" :steps="stepsNotifications" :options="optionsNotifications" :callbacks="callbacksNotifications"></v-tour>

    </v-container>
</template>
<script>
import {mapActions, mapGetters} from "vuex"
    import {getMessaging, getToken} from "firebase/messaging";
    export default {
        name: 'Notifications',
        inject: [
            'forceRerenderSidebar'
        ],
        data() {
            return {
                tab: 0,
                loading: false,
                language: null,
                page: 1,
                pageCount: 0,
                perPage: 25,
                totalVisiblePag: 5,
                totalNotifications: 0,
                notificationItems: [],
                no_data: false,
                dialog_device: false,
                devices: [],
                nextLink: true,
                optionsNotifications: {
                    startTimeout: 500,
                    useKeyboardNavigation: false,
                    labels: {
                        buttonSkip: this.$t('miss'),
                        buttonPrevious: this.$t('previous'),
                        buttonNext: this.$t('next'),
                        buttonStop: this.$t('finish'),
                    }
                },
                stepsNotifications: [
                    {
                        target: '#v-step-0',
                        content: this.$t('to_accept_notification'),
                        params: {
                            enableScrolling: false
                        }
                    },
                    {
                        target: '#v-step-1',
                        content: this.$t('make_all_notifications_read'),
                        params: {
                            enableScrolling: false
                        }
                    },
                    {   target: '#v-step-2',
                         content: this.$t('create_application'),
                         params: {
                             placement: 'top',
                             enableScrolling: true
                         }
                     },
                ],
                callbacksNotifications: {
                    onFinish: this.callbackOnFinishTour,
                    onSkip: this.callbackOnFinishTour,
                    onStop: this.callbackOnFinishTour,
                }
            }
        },
        computed: {
            ...mapGetters(['listLanguages', 'lang', 'countUnreadNotifications']),
            languages() {
                return this.listLanguages
            },
        },
        async mounted() {

            if (!localStorage.Notifications) {
                this.$tours['TourNotifications'].start()
            }
            this.language = this.languages[this.tab]
            await this.getNotifications()
        },

        methods: {
            ...mapActions(['setCountUnreadNotifications']),
            callbackOnFinishTour(){
                localStorage.Notifications = 1;
            },
            async getNotifications(page) {
                this.loading = true
                let params = {}
                if (page !== undefined) {
                    params.page = page;
                }
                if (this.perPage !== undefined) {
                    params.perPage = this.perPage;
                }
                if (this.lang) {
                    params.language = this.lang
                }
                await this.$http
                    .get("client/notifications", {
                        params: params,
                    })
                    .then(res => {
                        this.notificationItems = res.body.data
                        this.page = res.body.meta.current_page
                        this.totalNotifications = res.body.meta.total
                        this.pageCount = res.body.meta.last_page

                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }


                        if(this.notificationItems.length <= 0){
                            this.no_data = true;
                        }
                        else{
                            this.no_data = false;
                        }
                    })
                    .catch(err => {
                        this.notificationItems = []
                        this.totalNotifications = 0
                        this.$toastr.error(this.$t('failed_to_get_notifications'))

                    })
                    .finally(end => {
                        this.loading = false
                    })
            },
            async nextItems(){
                var _this = this;

                this.loading = true;
                let params = {};

                params.page = this.page + 1 ;
                params.sortBy = this.sortBy;
                params.sortDir = this.sortDir ? 'asc' : 'desc';
                params.perPage = this.perPage;
                if (this.lang) {
                    params.language = this.lang
                }


                await this.$http
                    .get("client/notifications", {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress2 = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        let data = res.body.data;
                        data.forEach((item) => {
                            this.notificationItems.push(item)
                        })

                        this.page = res.body.meta.current_page
                        this.totalNotifications = res.body.meta.total
                        this.pageCount = res.body.meta.last_page

                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }
                        data = [];
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_notifications'))
                    })
                    .finally(end => {
                        this.loading = false
                    })


            },
            async readNotifications() {
                this.loading = true
                await this.$http
                    .get("client/notifications/read")
                    .then(res => {
                        this.notificationItems.forEach((item) => {
                            item.read = 1;
                        });
                        this.setCountUnreadNotifications( 0 )
                        this.forceRerenderSidebar();
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('error_reading_notification'))
                    })
                    .finally(end => {
                        this.loading = false
                    })
            },

            notificationClick(item){

                if(item.read === 0){
                    this.notificationRead(item)
                }

                if(item.data && item.data.type && item.data.route ){

                    if((item.data.type === 'profile' || item.data.type === 'invoice' || item.data.type === 'tracking_updates' || item.data.type === 'invitation_accepted') && item.data.route !== ''){

                        this.$router.push({
                            name: item.data.route,
                        })
                    }
                    else if(item.data.type ===  'welcome'){

                        this.$router.push({
                            name: item.data.route,
                            params: item.data.params
                        })
                    }
                }
            },
            async notificationRead(item){
                this.loading = true
                var formData = new FormData()
                await this.$http
                    .put(`client/notifications/${item.uuid}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    })
                    .then(res => {
                        item.read = 1;
                        //Обновим колличество не прочитаных в хронилище
                        let count = this.countUnreadNotifications  - 1;
                        this.setCountUnreadNotifications( count )
                        this.forceRerenderSidebar();
                        // Если есть определенные переменные для перенаправления
                        if(item.data && item.data.type && item.data.route ){
                            if((item.data.type === 'profile' || item.data.type === 'invoice' || item.data.type === 'tracking_updates' || item.data.type === 'invitation_accepted') && item.data.route !== ''){
                                this.$router.push({
                                    name: item.data.route,
                                })
                            }
                        }

                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('notify_has_not_been_updated'))
                    })
                    .finally(end => {
                        this.loading = false
                    })
            },
            async getDevices() {
                this.loading = true
                let params = {}
                if (this.lang) {
                    params.language = this.lang
                }
                await this.$http
                    .get("client/device", {
                        params: params,
                    })
                    .then(res => {
                        this.devices = res.body.data
                        this.dialog_device = true;

                    })
                    .catch(err => {
                        this.devices = []
                        this.$toastr.error(this.$t('failed_to_get_list_devices'))

                    })
                    .finally(end => {
                        this.loading = false
                    })
            },
            async deleteDevice(item) {
                if (confirm(this.$t('delete_device'))) {
                    var _this = this
                    this.loading = true
                    await this.$http
                        .delete(`client/device/${item.id}`)
                        .then(res => {
                            this.$toastr.success(this.$t('device_has_been_deleted'))
                            this.getDevices()
                        })
                        .catch(err => {
                            this.$toastr.error(this.$t('device_has_not_been_deleted'))
                            if (err && err.body && err.body.message) {
                                for (let prop in err.body.errors) {
                                    if (hasOwnProperty.call(err.body.errors, prop)) {
                                        if (_this.$refs[prop]) {
                                            _this.$refs[prop].setErrors([
                                                err.body.errors[prop][0]
                                            ])
                                        }
                                    }
                                }
                                if (!err.body.errors) {
                                    this.$toastr.error(err.body.message)
                                }
                            }
                        })
                        .finally(end => {
                            this.loading = false
                        })
                }
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
                        this.getDevices();
                        console.log('Successfully saved notification token!')
                    })
                    .catch((err) => {
                        console.log('Error: could not save notification token')
                    })
            },
        }
    }
</script>
<style scoped>
.topic_background {

    border: 1px solid #f2f4f5;
}
.topic_title{
    font-weight:400;font-size:19px;color: #000
}
</style>
