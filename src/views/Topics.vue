<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 title_header">
                {{ $t('messages') }}
            </v-col>

            <v-col cols="12" class="px-0 mx-0" v-if="!no_data" >

                    <v-list two-line class="background_color_transparent" >
                        <v-list-item-group
                            v-model="selected"

                            class="my-0 "
                        >

                            <v-list-item
                                v-for="(item, i) in topicItems"
                                :key="i"
                                :class="'rounded-lg  ' + item.class + ' ' + ($vuetify.breakpoint.xsOnly ? 'pl-15' : 'px-3')"
                                class="mb-5 height_list_item"
                                @click="openChat(item)"
                            >

                                <template v-slot:default="{ active }">
                                <v-app-bar
                                    elevation="0"
                                    absolute
                                    class="my-5 py-0"
                                    height="0"
                                    v-if="!($vuetify.breakpoint.xsOnly)"
                                >
                                    <v-spacer></v-spacer>
                                    <v-icon class="icon_width " v-if="item.active">${{'lockOpenIcon'}}</v-icon>
                                    <v-icon v-else  class="icon_width">${{'lockIcon'}}</v-icon>

                                </v-app-bar>
                                <v-list-item-avatar size="58" class="border1_B3B3B3"   v-if="!($vuetify.breakpoint.xsOnly)">
                                    <img v-if="item.last_user.photo " :src="item.last_user.photo" >
                                    <v-icon v-else  size="26" class="color_B3B3B3">
                                        ${{'settingsIcon'}}
                                    </v-icon>
                                </v-list-item-avatar>



                                <v-list-item-content class="ml-6 topic_padding_top0">
                                    <v-row v-if="($vuetify.breakpoint.xsOnly)" class="my-0 py-0">
                                        <v-col cols="12" style="position: absolute;top:3px;left:-3px">
                                            <v-avatar size="58" class="border1_B3B3B3" >
                                                <img v-if="item.last_user.photo " :src="item.last_user.photo" >
                                                <v-icon v-else  size="26" class="color_B3B3B3">
                                                    ${{'settingsIcon'}}
                                                </v-icon>
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="12" style="position: absolute; bottom: 3px; left: 12px">
                                            <v-icon class="icon_width" size="35" v-if="item.active">${{'lockOpenIcon'}}</v-icon>
                                            <v-icon v-else size="50" class="icon_width">${{'lockIcon'}}</v-icon>

                                        </v-col>
                                    </v-row>
                                    <v-row class="topic_margin_top0">
                                        <v-col cols="12"  md="4" sm="4" lg="6" class="padding_top10_bottom0" >
                                            <v-list-item-title class="topic_title" v-text="item.title"></v-list-item-title>
                                            <v-list-item-subtitle
                                                style="max-width: 400px"
                                                :class="item.bot ? 'topic_text_bot' : 'topic_text'"
                                                                  v-if="(item.last_message && item.last_message.type && item.last_message.type==='text') ">
                                                <span class="font-weight-700">{{item.last_user.my ? $t('from_you') :  $t('from_name', {"name": item.last_user.name})}}</span>
                                                {{ item.last_message.value }}

                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle
                                                style="max-width: 400px"
                                                :class="item.bot ? 'topic_text_bot' : 'topic_text'"
                                                v-if="(item.last_message && item.last_message.type && item.last_message.type==='file') ">
                                                <span class="font-weight-700">{{item.last_user.my ? $t('from_you') :  $t('from_name', {"name": item.last_user.name})}}</span>
                                                {{item.last_message.file_name}}
                                            </v-list-item-subtitle>
                                            <v-list-item-subtitle
                                                style="max-width: 400px"
                                                :class="item.bot ? 'topic_text_bot' : 'topic_text'"
                                                v-if="(item.last_message && item.last_message.type && item.last_message.type==='image') ">
                                                <span class="font-weight-700">{{item.last_user.my ? $t('from_you') :  $t('from_name', {"name": item.last_user.name})}}
                                                    <v-img max-width="100" :src="item.last_message.value ? item.last_message.value : userAvatar" ></v-img>
                                                </span>
                                            </v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="12"  md="4" sm="4" lg="3" class="padding_top10_bottom0">
                                            <v-list-item-title class="topic_text">
                                                {{$t('last_message')}}
                                            </v-list-item-title>
                                            <v-list-item-subtitle class="topic_title">
                                                {{item.last_date}}
                                            </v-list-item-subtitle>
                                        </v-col>
                                        <v-col cols="12" md="4" sm="4" lg="3" class="padding_top10_bottom0">
                                            <v-list-item-title class="topic_text">
                                                {{$t('application_status')}}
                                            </v-list-item-title>
                                            <v-list-item-subtitle class="topic_title" >
                                                {{item.bot ? $t('system_message') : (item.active ? $t('open_application') : $t('closed_application')) }}
                                            </v-list-item-subtitle>
                                        </v-col>
                                    </v-row>


                                </v-list-item-content>

                                </template>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>


            </v-col>
        </v-row>

        <v-row v-if="no_data">
            <v-col cols="12" class="px-0 mx-0">
                <v-card flat class="px-0 mx-0 background_color_transparent">
                    <v-list-item-content>
                        <v-img src="img/no/dashboard.png"></v-img>
                    </v-list-item-content>
                </v-card>
            </v-col>
        </v-row>

        <v-sheet v-if="loading && topics.length === 0"
                 color="white lighten-5"
                 class="pa-1"
        >
            <v-skeleton-loader
                class="mx-auto"
                type="text,text,card,text,text,card,text,text"
            ></v-skeleton-loader>
        </v-sheet>



        <v-overlay :value="loading" z-index="10" color="#244ba8">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <v-tour name="TourTopic" :steps="stepsTopic" :options="optionsTopic" :callbacks="callbacksTopic"></v-tour>

    </v-container>

</template>
<script>

    import { mapGetters } from "vuex"

    export default {
        name: "Topics",

        data() {
            return {
                no_data: false,
                selected: [],
                topic_item: {},
                topic_uuid: null,
                date: null,
                dateDialog: false,
                client: null,
                clientItems: [],
                clientSearching: null,
                loadingClients: false,



                topic: null,
                topics: [],
                topicItems: [],
                active: 1,
                sortBy: "id",
                sortDir: true,
                page: 1,
                pageCount: 0,
                perPage: 5,
                totalVisiblePag: 5,
                totalTopics: 0,
                options: {},
                loading: false,
                headers: [

                    {
                        text: this.$t('name'),
                        align: "left",
                        sortable: true,
                        value: "title"
                    },
                    {
                        text: this.$t('client'),
                        align: "left",
                        sortable: true,
                        value: "client.name"
                    },
                    {
                        text: this.$t('date_created'),
                        align: "left",
                        sortable: true,
                        value: "created_at"
                    },
                    {
                        text: this.$t('active'),
                        align: "center",
                        sortable: true,
                        value: "active",
                        width: 110,
                    },
                    {
                        text: this.$t('open_chat'),
                        align: "center",
                        value: 'action',
                        sortable: false,
                        width: 120,
                    },
                    {
                        text: '',
                        value: 'data-table-expand',
                        width: 40,
                        class: "handle",
                    },
                ],
                optionsTopic: {
                    startTimeout: 500,
                    useKeyboardNavigation: false,
                    labels: {
                        buttonSkip: this.$t('miss'),
                        buttonPrevious: this.$t('previous'),
                        buttonNext: this.$t('next'),
                        buttonStop: this.$t('finish'),
                    }
                },
                stepsTopic: [

                    {   target: '#v-step-2',
                        content: this.$t('create_application'),
                        params: {
                            placement: 'top',
                            enableScrolling: true
                        }
                    },
                ],
                callbacksTopic: {
                    onFinish: this.callbackOnFinishTour,
                    onSkip: this.callbackOnFinishTour,
                    onStop: this.callbackOnFinishTour,
                }
            };
        },
        computed: {
            ...mapGetters(['lang','userAvatar']),

        },
        mounted() {
            if (!localStorage.TourTopic) {
                this.$tours['TourTopic'].start()
            }
            this.getTopics()
        },

        methods: {
            callbackOnFinishTour(){
                localStorage.TourTopic = 1;
            },
            async getTopics(type) {
                this.loading = true;
                let params = {}
                params.active = this.active

                await this.$http
                    .get("client/topic", {
                        params: params,
                    })
                    .then(res => {
                        this.topicItems = res.body.data
                        if(this.topicItems.length <= 0){
                            this.no_data = true;
                        }

                    })
                    .catch(err => {
                        this.topics = []

                        this.$toastr.error(this.$t('failed_to_get_list_topics'))
                    })
                    .finally(end => {
                        this.loading = false
                    })
            },
            openChat(item){
                if(item.company_info === true){
                    this.$router.push({
                        name: 'company.edit',
                        params: {
                            uuid: item.uuid
                        }
                    })
                }
                else {
                    this.$router.push({
                        name: 'topic.messages',
                        params: {
                            uuid: item.uuid
                        }
                    })
                }

            }

        }
    }
</script>
