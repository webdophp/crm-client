<template>
    <v-container >

        <v-app-bar
            class="pl-0 ml-0"
            elevation="0"
            color="#fff"
            app
            clipped-right
            flat
            height="72"
        >


            <v-toolbar color="elevation-0" class="toolbar_padding_0">

                <v-app-bar-nav-icon class="mr-0 pr-0 ">
                    <v-icon @click="backTopic">$backIcon</v-icon>
                </v-app-bar-nav-icon>
                <v-toolbar-title class="ml-1 pl-0">  {{topic_name}}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-menu offset-y class="mr-0 pr-0">
                    <template v-slot:activator="{ on, attrs }" >
                        <v-btn icon
                               v-bind="attrs"
                               v-on="on"
                               class="mr-0 pr-0"

                        >
                            <v-icon class="mr-0 pr-0">mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="(item, index) in button_menu"  :key="index"
                            @click="handleMainMenuClick(item.click)"
                            :disabled="(item.click==='close_topic' && topic_active===false) ?  true : false"
                        >

                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-toolbar>


        </v-app-bar>






        <v-card id="book"
                flat
                app
                class="scroll"


        >



            <v-card-text class="py-0 my-0">

                <div v-for="(chatMessages, date) in chatMessagesDate" :key="date">
                    <v-row style="clear: both" justify="center" align="center">
                        <v-chip draggable style="clear: both;background-color:#fff" class="my-10">{{ getDate(date) }}</v-chip>
                    </v-row>

                    <v-col v-for="msg in chatMessages" :key = "msg.id" style="clear: both" class="py-0 my-0">

                        <v-row v-if="msg.comment.type === 'manager'" style="clear: both" justify="center" align="center">
                            <v-chip draggable style="clear: both" class="my-10">{{ $t(msg.comment.value, {"name": msg.comment.name}) }}</v-chip>
                        </v-row>

                        <v-card v-if="msg.comment.type === 'bot'" elevation="1" class="my-10 d-inline-flex rounded-lg" justify="center">
                            <v-card-subtitle class="text-center">{{ $t(msg.comment.value, {"name": msg.comment.name}) }}</v-card-subtitle>
                        </v-card>

                        <v-card
                            v-if="msg.comment.type !== 'manager' && msg.comment.type !== 'bot'"
                            :class="msg.me ? 'float-right  rounded-br-0 me' : 'float-left rounded-tl-0 client' "  class="rounded-lg my-1 elevation-0"  style="max-width: 80%">
                            <v-card flat :class="msg.me ? 'me' : 'client'" class="my-0 px-0" >
                                <v-card-title class="name pt-2 pb-1">
                                    {{ msg.name }}
                                    <v-spacer></v-spacer>
                                    <v-menu offset-y>
                                        <template v-slot:activator="{ on, attrs }" >
                                            <v-btn icon
                                                   v-bind="attrs"
                                                   v-on="on"
                                                   x-small
                                                   :dark="!!msg.me"
                                            >
                                                <v-icon>mdi-dots-vertical</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-list>
                                            <v-list-item
                                                v-for="(item, index) in message_menu"  :key="index"
                                                @click="handleClick(item.click, msg, date)"
                                                :disabled="(item.click==='delete' && msg.me===false) ?  true : false"
                                            >
                                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                                            </v-list-item>
                                        </v-list>
                                    </v-menu>
                                </v-card-title>
                            </v-card>


                            <div class="float-left text pt-0 mt-0" :class="msg.me ? 'me' : 'client'" style="width: 97%" >
                                <div v-if="msg.comment.type === 'text'">
                                    {{ msg.comment.value }}
                                </div>

                                <v-img v-if="msg.comment.type === 'image'"
                                       class="mb-1"
                                       max-width="250"
                                       :src="msg.comment.value"
                                       @click="ImageView(msg,date)"
                                >

                                    <v-row v-if="msg.delivered ? false : true"
                                           class="fill-height ma-0"
                                           align="center"
                                           justify="center"

                                    >
                                        <v-progress-circular
                                            indeterminate
                                            color="grey lighten-5"
                                        ></v-progress-circular>
                                    </v-row>
                                </v-img>


                                <v-list v-if="msg.comment.type === 'file'"  :class="msg.me ? 'me' : 'client'" >
                                    <v-list-item :dark="!!msg.me">
                                        <v-list-item-icon >

                                            <v-row v-if="msg.delivered ? false : true"
                                                   class="fill-height ma-0"
                                                   align="center"
                                                   justify="center"
                                            >
                                                <v-progress-circular
                                                    indeterminate
                                                    color="grey lighten-5"
                                                ></v-progress-circular>
                                            </v-row>

                                            <v-btn
                                                @click="downloadFile(msg.comment.value, msg.comment.file_name)"
                                                icon
                                            >
                                                <v-icon v-if="msg.delivered" :class="msg.me ? 'me' : 'client'">mdi-arrow-down-circle-outline mdi-36px</v-icon>
                                            </v-btn>
                                        </v-list-item-icon>
                                        <v-list-item-content >
                                            <v-list-item-title :class="msg.me ? 'me' : 'client'"> {{ msg.comment.file_name }} </v-list-item-title>
                                            <v-list-item-subtitle :class="msg.me ? 'me' : 'client'">{{ (Number(msg.comment.size) / 1000).toFixed(1) + ' KB' }} {{ msg.comment.file_type }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                                <v-card-title class="mx-0 px-0 my-0 py-0 time">
                                    <v-spacer></v-spacer>

                                    <v-icon :class="msg.me ? 'me' : 'client'" class="mx-0 px-0 pr-1 my-0 py-0 delivered" right>
                                        {{ msg.delivered ? 'mdi-check-all' : 'mdi-check'}}
                                    </v-icon>
                                    {{ $moment(msg.created_at).format('HH:mm') }}
                                </v-card-title>
                            </div>

                        </v-card>




                    </v-col>
                </div>
            </v-card-text>

            <v-card-actions class="py-0 my-0">
                <v-file-input hide-input prepend-icon=""
                              v-model="documents"
                              accept=".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              id="document"
                              multiple
                              @change="previewDocuments"
                >
                </v-file-input>
                <v-file-input hide-input prepend-icon=""
                              v-model="images"
                              accept="image/*"
                              id="images"
                              multiple
                              @change="previewImages"
                >

                </v-file-input>
            </v-card-actions>
        </v-card>

        <v-footer
            app
            color="#fff"
            min-height="100"
            inset
        >

            <v-textarea
                v-model="text"
                :label="$t('message')"
                no-details
                outlined
                rows="3"
                auto-grow
                id="chat-message-typer-textarea"
                @keyup.enter="SentMessage()"
                v-if="topic_active"
                hide-details
            >
                <template v-slot:append>
                    <v-icon class="pt-2" @click="sheet_paperclip=true">mdi-paperclip </v-icon>
                </template>




            </v-textarea>
            <v-btn icon class="ml-2"

                     @click="SentMessage()">
                <v-icon dark>
                    mdi-send
                </v-icon>
            </v-btn>


        </v-footer>

        <v-bottom-sheet inset v-model="sheet_paperclip">
            <v-sheet color="primary">
                <v-list-item-group>
                    <v-list-item dark @click="document.getElementById('document').click()">
                        <v-list-item-icon>
                            <v-icon>mdi-paperclip</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="white--text">{{ $t('documents') }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>


                    <v-list-item dark @click="document.getElementById('images').click()">
                        <v-list-item-icon >
                            <v-icon>mdi-image</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="white--text">{{$t('gallery')}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                </v-list-item-group>

            </v-sheet>
        </v-bottom-sheet>


        <v-dialog
            v-model="dialog_file"
            scrollable
            persistent
            max-width="500px"


        >
            <v-card>
                <v-card-title class="px-2 mx-0">
                    <v-icon @click="dialog_file = false;document_urls=[];documents=[]">mdi-close</v-icon>
                    <span class="pl-5">{{ $t('send_files', {'count': document_urls.length}) }}</span>
                    <v-spacer></v-spacer>
                    <v-menu
                        bottom
                        left
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="(item, i) in button_menu"
                                :key="i"
                                @click="() => {}"
                            >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text  style="height: 300px;">
                    <v-list subheader>
                        <v-list-item  v-for="document in document_urls" :key="document.id">
                            <v-list-item-icon>
                                <v-img
                                    max-width="90"
                                    :alt="`${document.name}`"
                                    :src="document.url"
                                    max-height="60"
                                ></v-img>
                                <v-icon
                                    x-large
                                    v-if="!mimeTypeImage(document.type)">mdi-file-document-outline mdi-48px</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title v-text="document.name"></v-list-item-title>
                                <v-list-item-subtitle v-text="(document.size / 1000).toFixed(1) + ' KB'"></v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-icon class="d-flex align-self-center mt-2">
                                <v-btn
                                    icon

                                >
                                    <v-icon> mdi-delete-outline</v-icon>
                                </v-btn>

                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>


                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"

                        @click="SentMessageFile"
                    >
                        {{$t('sent')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialog_image"
            scrollable
            persistent
            max-width="500px"
        >
            <v-card>
                <v-card-title class="px-2 mx-0">
                    <v-icon @click="dialog_image = false;image_urls=[];images=[]">mdi-close</v-icon>
                    <span class="pl-5">{{ $t('send_photos', {'count': image_urls.length}) }}</span>
                    <v-spacer></v-spacer>
                    <v-menu
                        bottom
                        left
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                icon
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="(item, i) in button_menu"
                                :key="i"
                                @click="() => {}"
                            >
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text  style="height: 300px;">

                    <v-container fluid>
                        <v-row dense>
                            <v-col
                                v-for="image in image_urls" :key="image.id"
                                :cols="image.cols"
                            >
                                <v-card>
                                    <v-img
                                        :alt="`${image.name}`"
                                        :src="image.url"
                                        height="200"
                                        class="white--text align-end"
                                    >
                                        <v-card-title>
                                            <v-spacer></v-spacer>
                                            <v-btn icon>
                                                <v-icon> mdi-delete-outline</v-icon>
                                            </v-btn>
                                        </v-card-title>
                                    </v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>



                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"

                        @click="SentMessagePhoto"
                    >
                        {{$t('sent')}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialog_image_view"
            scrollable
            fullscreen
            v-if="!!image_view.comment"
        >
            <v-card>
                <v-card-title class="px-2 mx-0">
                    <span class="pl-5">{{ image_view.comment.file_name }}</span>
                    <v-spacer></v-spacer>
                    <v-tooltip >
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on"
                                   @click="downloadFile(image_view.comment.value,image_view.comment.file_name)"
                                   icon>
                                <v-icon>mdi-arrow-collapse-up mdi-flip-v</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t('download')  }}</span>
                    </v-tooltip>
                    <v-tooltip v-if="image_view.me">
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on"
                                   @click="ImageDelete(image_view)"
                                   icon>
                                <v-icon>mdi-delete-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t('delete')  }}</span>
                    </v-tooltip>
                    <v-tooltip >
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on"
                                   @click="ImageViewClose()"
                                   icon>
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t('close')  }}</span>
                    </v-tooltip>
                </v-card-title>

                <v-card-text  style="height: 300px;">

                    <v-container fluid>
                        <v-row dense>
                            <v-col                                >
                                <v-card>
                                    <v-img
                                        :alt="`${image_view.comment.file_name}`"
                                        :src="image_view.comment.value"


                                    >

                                    </v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>



                </v-card-text>


            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialog_favorite_view"
            scrollable
            fullscreen
        >
            <v-card>
                <v-card-title class="px-2 mx-0">
                    <span class="pl-5">{{ $t('favourites') }}</span>
                    <v-spacer></v-spacer>
                    <v-tooltip >
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on"
                                   @click="closeFavourites()"
                                   icon>
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ $t('close')  }}</span>
                    </v-tooltip>
                </v-card-title>

                <v-card-text  style="height: 300px;">
                    <v-container fluid>
                        <v-card-text class="mt-5">
                            <v-col v-for="msg in favoriteMessageItems" :key = "msg.id" style="clear: both">
                                <v-card :class="msg.me ? 'float-right' : 'float-left' " class="py-1 my-4 rounded-0 rounded-lg primary" style="max-width: 80%">
                                    <v-card flat color="primary" class="mx-0 p-0" >
                                        <v-card-title dark class="mx-0 px-2 my-0 py-0 font-size-14 white--text">
                                            {{ msg.name }}
                                            <v-spacer></v-spacer>
                                            <v-menu offset-y>
                                                <template v-slot:activator="{ on, attrs }" >
                                                    <v-btn icon
                                                           v-bind="attrs"
                                                           v-on="on"
                                                           x-small
                                                           dark
                                                    >
                                                        <v-icon>mdi-dots-vertical</v-icon>
                                                    </v-btn>
                                                </template>
                                                <v-list>
                                                    <v-list-item
                                                        v-for="(item, index) in favorite_menu"  :key="index"
                                                        @click="handleFavoriteClick(item.click, msg)"

                                                    >
                                                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </v-card-title>
                                    </v-card>
                                    <div class="float-left white--text px-2 pb-1 " style="width: 97%" >
                                        <div v-if="msg.comment.type === 'text'">
                                            {{ msg.comment.value }}
                                        </div>

                                        <v-img v-if="msg.comment.type === 'image'"
                                               class="ml-4 mb-3"
                                               max-width="250"
                                               :src="msg.comment.value"
                                               @click="ImageView(msg,date)"
                                        >
                                        </v-img>

                                        <v-list v-if="msg.comment.type === 'file'" class="px-0 mx-0 py-0 my-0"  dark color="primary" >
                                            <v-list-item class="px-0 mx-0 py-0 my-0">
                                                <v-list-item-icon class="px-0 mx-0 py-0 my-0 pt-2">
                                                    <v-btn
                                                        icon
                                                        :href="msg.comment.value"
                                                        download>
                                                        <v-icon class="px-0 mx-0 py-0 my-0">mdi-arrow-down-circle-outline mdi-36px</v-icon>
                                                    </v-btn>
                                                </v-list-item-icon>
                                                <v-list-item-content class="px-0 mx-0 py-0 my-0">
                                                    <v-list-item-title class="px-0 mx-0 py-0 my-0"> {{ msg.comment.file_name }} </v-list-item-title>
                                                    <v-list-item-subtitle class="px-0 mx-0 py-0 my-0">{{ (Number(msg.comment.size) / 1000).toFixed(1) + ' KB' }} {{ msg.comment.file_type }}</v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                        <v-card-title class="mx-0 px-0 my-0 py-0 font-size-12">
                                            <v-spacer></v-spacer>
                                            {{ $moment(msg.created_at).format('HH:mm') }}
                                        </v-card-title>
                                    </div>

                                </v-card>
                            </v-col>
                        </v-card-text>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-overlay :value="loadingMessages" z-index="10" color="#244ba8">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script>

import debounce from "lodash/debounce"
import {mapActions, mapGetters} from "vuex";


export default {
    name: 'TopicForm3',
    data() {
        return {
            loadingMessages: false,
            count_messages: 0,
            dialog_image_view:false,
            image_view: {},
            document,
            document_urls: [],
            dialog_file: false,
            documents:[],
            image_urls:[],
            images:[],
            dialog_favorite_view: false,
            dialog_image: false,
            topic_name: '',
            sheet_paperclip: false,
            topic_uuid: this.$route.params.uuid,
            chatMessages: [],
            chatMessagesDate: [],
            favoriteMessageItems: [],
            favorite_menu: [
                { title: this.$t('delete'), click: "delete"},
            ],
            message_menu: [
                { title: this.$t('delete'), click: "delete"},
                { title: this.$t('to_favourites'), click: "add_favourite" },
            ],
            button_menu: [
                { title:  this.$t('close_topic'), click:"close_topic"},
                //{ title:  this.$t('open_topic'), click:"open_topic"},
                { title:  this.$t('favourites'), click:"favourites"},
            ],
            loading: false,
            topic_active: false,
            topic_id: null,
            text: null,
            text2: null,
            window: {
                width: 0,
                height: 0
            }
        }
    },
    computed: {
        ...mapGetters(['timezone']),
    },
    watch: {
        count_messages: debounce(function (val) {
            document.body.scrollIntoView(false);

        }, 0),
    },

    async mounted() {
        await this.getMessages();
        await this.listenChannelWebsocket2()
        document.body.scrollIntoView(false);

    },
    methods: {
        ...mapActions(['setUserName']),
        backTopic(){
            if(window.history.length > 2){
                window.history.back();
            }
            else{
                this.$router.push({
                    name: 'topic'
                })
            }

        },

        handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;

        },
        handleMainMenuClick(click){
            switch (click){
                case 'close_topic':
                    this.closeTopic();
                    break;
                case 'open_topic' :
                    this.openTopic()
                    break;
                case 'favourites' :
                    this.getFavourites()
                    break;
            }
        },
        handleClick(click,msg, date) {
            switch (click) {
                case 'delete':
                    this.deleteMessages(msg,date)
                    break;
                case 'add_favourite' :
                    this.addFavourite(msg)
                    break;
            }
        },
        handleFavoriteClick(click,msg) {
            switch (click) {
                case 'delete':
                    this.deleteFavoriteMessages(msg)
                    break;

            }
        },

        ImageViewClose(){
            this.dialog_image_view = false;
            this.image_view = {};
        },
        ImageView(msg,date){
            this.dialog_image_view = true;
            this.image_view = msg;
        },
        ImageDelete(msg){
            if (confirm(this.$t('do_you_really_want_to_delete'))) {
                this.deleteMessages(msg,msg.date)
                this.ImageViewClose();
            }
        },
        previewDocuments() {
            let i = this.document_urls.length
            let data = {}
            this.documents.forEach((document) => {
                data = {}
                data.id = i
                data.url = URL.createObjectURL(document)
                data.name = document.name
                data.blob =  document
                data.size = document.size
                data.type = document.type
                this.document_urls.push(data)
                i++
            })
            this.dialog_file = true
            this.sheet_paperclip = false
        },
        previewImages() {
            let i = this.image_urls.length
            let data = {}
            const even = n => !(n % 2);
            this.images.forEach(async (image) =>  {
                if(this.mimeTypeImage(image.type)){
                    data = {}
                    data.id = i
                    data.url = URL.createObjectURL(image)
                    data.name = image.name
                    data.blob =  image
                    //data.blob =  await this.convertBlobToBase64(image)
                    data.size = image.size
                    data.type = image.type
                    data.cols = Number(data.id + 1) === Number(this.images.length) ? (even(this.images.length) ? 6 : 12)  : 6
                    this.image_urls.push(data)
                    i++
                }
            })
            this.dialog_image = true
            this.sheet_paperclip = false
        },
        listenChannelWebsocket2() {
            //console.log('ddddd' + `App.Models.Admin.${this.$auth.user().id}`)
            //console.log('ddddd' + `.Event.Chat.${this.topic_id}`)
            window.Echo
                .private(`App.Models.Client.${this.$auth.user().id}`)
                .listen(`.Event.Chat.${this.topic_id}`, (event) => {
                    console.log(event)
                    //Если пришло добавление собщение
                    if(event && event.id && event.id > 0) {
                        if (event.comment && event.comment.type) {
                            if(this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')] === undefined) {
                                const newMessage = {
                                    [this.$moment().format('YYYY-MM-DD')]:
                                        [
                                            event
                                        ]
                                }
                                this.chatMessagesDate = { ...this.chatMessagesDate, ...newMessage };

                            }
                            else{
                                let index = Number(event.id_array) - 1;
                                let message_date = this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')];
                                if (typeof message_date[index] != "undefined") {
                                    message_date[index].id = event.id;
                                    //this.chatMessages[index].name = event.name;
                                    //message_date[index].comment = event.comment;
                                    //  message_date[index].created_at = event.created_at;
                                    message_date[index].delivered = event.delivered;
                                    //  this.chatMessages[index].me = event.me;
                                    message_date[index].uuid = event.uuid;
                                }
                                else {
                                    message_date.push(event);
                                }
                            }
                        }

                    }
                    else if(event && event.type && event.type==='delete'){
                        //Если пришло удаление собщение
                        if (event.id_array && event.id_array > 0 && event.date) {
                            //if(event.admin_id !== this.$auth.user().id){
                            this.chatMessagesDate[event.date].splice(event.id_array, 1);
                            // }

                        }
                    }
                    this.count_messages++;
                });
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

        async SentMessagePhoto() {
            var _this = this;
            let formData, blob;
            this.dialog_image = false;
            this.images=[]

            let id_array = 0;
            for (const image of this.image_urls) {

                if(this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')] === undefined) {
                    id_array = 1;
                    const newMessage = {
                        [this.$moment().format('YYYY-MM-DD')]:
                            [
                                {
                                    "id": Number(new Date().getTime()) + 1,
                                    "uuid": "uuid",
                                    "me": true,
                                    "comment": {"type": "image", "value": image.url},
                                    "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                                    "delivered": false,
                                    "name": this.$auth.user().name,
                                }
                            ]
                    }
                    this.chatMessagesDate = { ...this.chatMessagesDate, ...newMessage };
                }
                else{
                    id_array = this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].length + 1;
                    this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].push({
                        "id": Number(new Date().getTime()) + (this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].length) + 1,
                        "uuid": "uuid",
                        "me": true,
                        "comment": {"type": "image", "value": image.url},
                        "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                        "delivered": false,
                        "name": this.$auth.user().name,
                    });
                }


                formData = new FormData();
                formData.append('id_array', id_array)
                formData.append('topic_uuid', this.topic_uuid)
                formData.append('type_mime', image.type)
                formData.append('size', image.size)
                formData.append('file_name', image.name)
                image.blob =  await this.convertBlobToBase64(image.blob)
                if (image.blob) {
                    blob = this.dataURL64toBlob(image.blob)
                    if (blob) {
                        formData.append('photo', blob, image.type)
                    }
                }

                // Add
                this.$http
                    .post('client/message/photo', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(res => {

                        var index = this.chatMessages.length + 1
                        if (typeof this.chatMessages[index] != "undefined") {
                            this.chatMessages[index].delivered = true;
                        }
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('page_has_not_been_added'))
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
                        var index = this.chatMessages.length + 1
                        if (typeof this.chatMessages[index] != "undefined") {
                            this.chatMessages[index].delivered = true;
                        }
                    })


            }
            this.image_urls=[];
            this.count_messages++;
        },
        async SentMessageFile() {
            var _this = this;
            let formData, blob;
            this.dialog_file = false;
            this.documents=[]



            let id_array = 0;
            for (const file of this.document_urls) {
                if(this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')] === undefined) {
                    id_array = 1;
                    const newMessage = {
                        [this.$moment().format('YYYY-MM-DD')]:
                            [
                                {
                                    "id": Number(new Date().getTime()) + 1,
                                    "uuid": "uuid",
                                    "me": true,
                                    "comment": {"type": "file", "value": file.url, "file_name":file.name, "size":file.size},
                                    "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                                    "delivered": false,
                                    "name": this.$auth.user().name,
                                }
                            ]
                    }
                    this.chatMessagesDate = { ...this.chatMessagesDate, ...newMessage };
                }
                else{
                    id_array = this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].length + 1;
                    this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].push({
                        "id": Number(new Date().getTime()) + (this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].length) + 1,
                        "uuid": "uuid",
                        "me": true,
                        "comment": {"type": "file", "value": file.url, "file_name":file.name, "size":file.size},
                        "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                        "delivered": false,
                        "name": this.$auth.user().name,
                    });
                }

                formData = new FormData();
                formData.append('id_array', id_array)
                formData.append('topic_uuid', this.topic_uuid)
                formData.append('type_mime', file.type)
                formData.append('size', file.size)
                formData.append('file_name', file.name)
                file.blob =  await this.convertBlobToBase64(file.blob)
                if (file.blob) {
                    blob = this.dataURL64toBlob(file.blob)
                    if (blob) {
                        formData.append('file', blob, file.type)
                    }
                }
                // Add
                this.$http
                    .post('client/message/file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(res => {
                        var index = this.chatMessages.length + 1
                        if (typeof this.chatMessages[index] != "undefined") {
                            this.chatMessages[index].delivered = true;
                        }
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('page_has_not_been_added'))
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
                        var index = this.chatMessages.length + 1
                        if (typeof this.chatMessages[index] != "undefined") {
                            this.chatMessages[index].delivered = true;
                        }
                    })


            }
            this.document_urls=[];
            this.count_messages++;
        },
        async SentMessage() {
            var _this = this;
            this.progress = 0

            this.loading = true
            var formData = new FormData()

            if( typeof this.text  === 'undefined' || this.text  === null || this.text === ''){
                return;
            }
            if (this.languages && this.languages[this.tab]) {
                formData.append('language', this.languages[this.tab])
            }
            if (this.text) {
                formData.append('message', this.text)
            }
            formData.append('topic_uuid', this.topic_uuid)
            if(this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')] === undefined) {
                formData.append('id_array', 1)
            }
            else{
                formData.append('id_array', this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].length + 1)
            }

            // Add
            await this.$http
                .post('client/message', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    progress(e) {
                        if (e.lengthComputable) {
                            _this.progress = Math.round((e.loaded / e.total) * 100)
                        }
                    }
                })
                .then(res => {
                    if(this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')] === undefined) {
                    const newMessage = {
                        [this.$moment().format('YYYY-MM-DD')]:
                            [
                                {
                                    "id": Number(new Date().getTime()) + 1,
                                    "uuid": "uuid",
                                    "me": true,
                                    "comment": {"type": "text", "value": this.text},
                                    "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                                    "delivered": false,
                                    "name": this.$auth.user().name,
                                }
                            ]
                    }
                    this.chatMessagesDate = { ...this.chatMessagesDate, ...newMessage };
                }
                    else{
                        this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].push({
                            "id": Number(new Date().getTime()) + this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].length + 1,
                            "uuid": "uuid",
                            "me": true,
                            "comment": {"type": "text", "value": this.text},
                            "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                            "delivered": false,
                            "name": this.$auth.user().name,
                        });
                    }
                    this.text = ''
                    this.count_messages++;
                })
                .catch(err => {
                    this.$toastr.error(this.$t('message_has_not_been_added'))
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
                    this.progress = 0
                    this.loading = false
                })


        },
        async getMessages() {
            this.loadingMessages = true;
            let params = {};
            params.topic_uuid = this.topic_uuid;

            await this.$http
                .get("client/message", {
                    params: params,
                })
                .then(res => {
                    this.chatMessagesDate = res.body.data
                    this.topic_name = res.body.topic
                    this.topic_id = res.body.topic_id
                    this.topic_active = res.body.topic_active
                })
                .catch(err => {
                    this.chatMessagesDate = []
                    this.topic_name = ''
                    this.topic_id = null
                    this.$toastr.error(this.$t('failed_to_get_list_messages'))
                })
                .finally(end => {
                    this.loadingMessages = false
                })
        },
        async deleteMessages(msg,date) {
            this.loading = true;
            let params = {};
            let idx = this.chatMessagesDate[date].indexOf(msg);
            params.topic_uuid = this.topic_uuid;
            params.message_uuid = msg.uuid;
            params.date = date;
            if (idx !== -1) {
                params.id_array = idx;
            }

           await this.$http
                .delete(`client/message/${this.topic_uuid}`,{
                    params: params,
                })
                .then(res => {

                    //let index = this.chatMessagesDate[date].findIndex(el => el.uuid === "4fb4bc6b-9a77-40fb-99aa-865c73a4b004");
                    if (idx !== -1) {
                        this.chatMessagesDate[date].splice(idx, 1);
                    }
                    this.$toastr.success(this.$t('message_has_been_deleted'))
                })
                .catch(err => {
                    this.$toastr.error(this.$t('message_has_not_been_deleted'))
                })
                .finally(end => {
                    this.loading = false
                })

        },
        async closeTopic() {

            var _this = this;
            this.progress = 0
            this.loading = true
            var formData = new FormData()

            formData.append('topic_uuid', this.topic_uuid)

            await this.$http
                .put('client/topic/close', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    progress(e) {
                        if (e.lengthComputable) {
                            _this.progress = Math.round((e.loaded / e.total) * 100)
                        }
                    }
                })
                .then(res => {
                    this.$toastr.success(this.$t('topic_is_closed'))
                    this.topic_active = false;

                })
                .catch(err => {
                    this.$toastr.error(this.$t('topic_was_not_closed'))
                })
                .finally(end => {
                    this.loading = false
                })
        },
        async openTopic() {

            var _this = this;
            this.progress = 0
            this.loading = true
            var formData = new FormData()

            formData.append('topic_uuid', this.topic_uuid)

            await this.$http
                .put('client/topic/open', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    progress(e) {
                        if (e.lengthComputable) {
                            _this.progress = Math.round((e.loaded / e.total) * 100)
                        }
                    }
                })
                .then(res => {
                    this.$toastr.success(this.$t('topic_is_open'))
                    this.topic_active = true;

                })
                .catch(err => {
                    this.$toastr.error(this.$t('topic_was_not_open'))
                })
                .finally(end => {
                    this.loading = false
                })
        },
        async addFavourite(msg) {

            var _this = this;
            this.progress = 0
            this.loading = true
            var formData = new FormData()

            formData.append('topic_uuid', this.topic_uuid)
            formData.append('chat_uuid', msg.uuid)

            await this.$http
                .post('client/favorite_message', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    progress(e) {
                        if (e.lengthComputable) {
                            _this.progress = Math.round((e.loaded / e.total) * 100)
                        }
                    }
                })
                .then(res => {
                    this.$toastr.success(this.$t('favorite_message_has_been_added'))
                    this.topic_active = true;

                })
                .catch(err => {
                    this.$toastr.error(this.$t('favorite_message_has_not_been_added'))
                })
                .finally(end => {
                    this.loading = false
                })
        },
        async getFavourites() {
            this.loading = true;
            let params = {};
            params.topic_uuid = this.topic_uuid;

            await this.$http
                .get("client/favorite_message", {
                    params: params,
                })
                .then(res => {
                    this.favoriteMessageItems = res.body.data
                    this.dialog_favorite_view = true;
                })
                .catch(err => {
                    this.favoriteMessageItems = []
                    this.$toastr.error(this.$t('failed_to_get_list_messages'))
                })
                .finally(end => {
                    this.loading = false
                })
        },
        async closeFavourites() {
            this.favoriteMessageItems = []
            this.dialog_favorite_view = false;
        },
        async deleteFavoriteMessages(msg) {
            this.loading = true;
            let params = {};

            await this.$http
                .delete(`client/favorite_message/${msg.uuid}`,{
                    params: params,
                })
                .then(res => {

                    let idx = this.favoriteMessageItems.indexOf(msg);
                    if (idx !== -1) {
                        this.favoriteMessageItems.splice(idx, 1);
                    }
                    this.$toastr.success(this.$t('favorite_message_has_been_deleted'))
                })
                .catch(err => {
                    this.$toastr.error(this.$t('favorite_message_has_not_been_deleted'))
                })
                .finally(end => {
                    this.loading = false
                })

        },

        downloadFile(url, name) {
            fetch(url)
                .then((resp) => resp.blob())
                .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = name;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this.$toastr.success(this.$t('file_download_started'))
                })
                .catch(() =>
                    this.$toastr.error(this.$t('file_download_error'))

                );
        },
    },

}

</script>

<style scoped>

.v-toolbar__content{
    padding: 0 !important;
    margin: 0 !important;
}
.client{
    background-color: #f2f4f5;
    color: #000;
}
.me{
    background-color: #244ba8;
    color: #fff;
}

.name{
    font-size: 1rem;

}

.text{
    padding: 0 16px;
    font-weight: 400;
    font-size: 17px;
    line-height: 24px;
    word-break: break-word;
}

.time{
    font-size: 12px;
}

.delivered{
    font-size: 12px;
}


::-webkit-scrollbar {
    height: 5px;
    width: 5px;
    background: #fff;
}

::-webkit-scrollbar-thumb {
    background-color: #edeff0;

}

::-webkit-scrollbar-corner {
    background: #fff;
}


</style>

<style>
.toolbar_padding_0 .v-toolbar__content{
    padding: 0 !important;
    margin: 0 !important;
}
</style>








