<template>
    <v-container
        @drop.prevent="dragover = false"
        @dragover.prevent="dragover = true"
        @dragenter.prevent="dragover = true"
        @dragend.prevent="dragover = false"
    >

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
                <v-toolbar-title class="ml-1 pl-0">
                    <v-card-title>{{topic_name}}</v-card-title>
                    <v-card-subtitle>{{$t('usual_reply_time_min')}}</v-card-subtitle>
                </v-toolbar-title>

                <v-spacer></v-spacer>



                <div class="avatars" v-if="!$vuetify.breakpoint.xsOnly">
                    <span class="avatar" v-for="(item, index) in avatars"  :key="index">
                          <v-avatar size="50" >
                              <img :title="item.name" class="avatar_border" :src="item.photo ? item.photo : '/img/avatar.png'" />
                          </v-avatar>
                    </span>
                </div>

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
                        <v-list-item class="text-center" v-if="$vuetify.breakpoint.xsOnly">
                            <div class="avatars">
                                <span class="avatar" v-for="(item, index) in avatars"  :key="index">
                                      <v-avatar size="40" >
                                          <img :title="item.name" class="avatar_border" :src="item.photo ? item.photo : '/img/avatar.png'" />
                                      </v-avatar>
                                </span>
                            </div>
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

                        <v-card :id="'div_'+msg.uuid"
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


                            <div class="float-left text pt-0 mt-0" :class="msg.me ? 'me' : 'client'" style="width: 97%;" >

                                <div v-if="msg.reply">
                                   <div @click="replyScroll(msg.reply.reply_uuid)" :class="msg.me ? 'reply_me' : 'reply_client'" >

                                       <div v-if="msg.reply.type === 'text'" class="pt-2 px-2 overflow_hide">
                                           <span class="reply_name">{{ msg.reply.name }}</span>
                                           <span class="font-size-10">{{ msg.reply.value }}</span>
                                        </div>

                                       <div v-if="msg.reply.type === 'image'" class="d-flex">
                                           <div class="mr-auto pt-2 px-2">
                                               <span class="reply_name">{{ msg.reply.name }}</span>
                                               <span class="font-size-10">
                                                   {{$t('photo')}}
                                                   <v-icon left x-small :dark="msg.me">
                                                       mdi-camera-outline
                                                   </v-icon>
                                               </span>
                                           </div>
                                           <v-img v-if="msg.reply.type === 'image'"
                                                  class="mx-0 my-0 px-0 py-0"
                                                  max-width="50"
                                                  :src="msg.reply.value"

                                           >


                                           </v-img>
                                       </div>

                                       <div v-if="msg.reply.type === 'file'">
                                           <div class="pt-2 px-2">
                                               <span class="reply_name">{{ msg.reply.name }}</span>
                                               <span class="font-size-10">
                                                   {{msg.reply.file_name}}
                                                   <v-icon left small :dark="msg.me">
                                                       mdi-paperclip
                                                   </v-icon>

                                               </span>
                                           </div>



                                       </div>

                                   </div>
                                </div>


                                <div
                                    v-if="msg.comment.type === 'text'"
                                    style="min-width: 200px">
                                    {{ msg.comment.value }}
                                    <div class="d-flex justify-start mt-2" v-if="msg.comment.click  && msg.comment.click.length > 0">
                                        <div v-for="(click, index) in msg.comment.click"  :key = "index"
                                             @click="clientClick(click,msg.uuid)"
                                             style="padding-top: 10px;color: #0c214e; text-decoration:underline;cursor: pointer"
                                        >{{ $t('go_over')}}</div>
                                    </div>
                                </div>


                                <div v-if="msg.comment.type === 'image'">
                                    <v-img
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
                                    <div class="px-0 mx-0 py-0 my-0" v-if="msg.comment.text !== ''">
                                        {{msg.comment.text}}
                                    </div>
                                    <div class="d-flex justify-start mt-2">
                                        <div v-if="msg.comment.confirmed && msg.comment.confirmed === '1'">
                                            {{msg.comment.confirmed_text}}
                                        </div>
                                        <div v-else-if="msg.comment.confirmed && msg.comment.confirmed === '0'">
                                            {{msg.comment.confirmed_text}}
                                        </div>
                                        <div v-else-if="msg.comment.click && msg.comment.click.length > 0" v-for="(click, index) in msg.comment.click"  :key = "index">
                                            {{msg.comment.confirmed}}
                                            <div style="margin: 0 10px 0 0; border-bottom: 1px dashed" @click="clientClick(click,msg.uuid)">{{click.text}}</div>
                                        </div>
                                    </div>
                                </div>



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
                                    <div class="px-0 mx-0 py-0 my-0" v-if="msg.comment.text !== ''">
                                        {{msg.comment.text}}
                                    </div>
                                    <div class="d-flex justify-start mt-2">
                                        <div v-if="msg.comment.confirmed && msg.comment.confirmed === '1'">
                                            {{msg.comment.confirmed_text}}
                                        </div>
                                        <div v-else-if="msg.comment.confirmed && msg.comment.confirmed === '0'">
                                            {{msg.comment.confirmed_text}}
                                        </div>
                                        <div v-else-if="msg.comment.click && msg.comment.click.length > 0" v-for="(click, index) in msg.comment.click"  :key = "index">
                                            {{msg.comment.confirmed}}
                                            <div style="margin: 0 10px 0 0; border-bottom: 1px dashed" @click="clientClick(click,msg.uuid)">{{click.text}}</div>
                                        </div>
                                    </div>
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
                              v-model="files"
                              accept="image/*,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              id="file"
                              multiple
                              @change="previewFiles"
                >
                </v-file-input>
            </v-card-actions>
        </v-card>


        <v-footer
            app
            color="#fff"
            min-height="100"
            inset
            class="mt-0 pt-0"


        >
            <v-card width="100%" elevation="0" app inset tile>
                <v-toolbar
                    color="white"
                    height="50px"
                    elevation="0"
                    v-if="toolbar_reply"
                >
                    <div class="reply" >
                        <div class="pt-0 px-2" v-if="reply_msg.type === 'text'">
                            <span class="reply_name"> {{ reply_name}} </span>
                            <span class="font-size-10">{{ reply_msg.value }}</span>
                        </div>
                        <div v-if="reply_msg.type === 'image'" class="d-flex">
                            <v-img v-if="reply_msg.type === 'image'"
                                   class="ml-1 my-0 px-0 py-0"
                                   max-width="50"
                                   :src="reply_msg.value"

                            >
                            </v-img>
                            <div class="mr-auto pt-0 px-2">
                                <span class="reply_name">{{ reply_name}}</span>
                                <span class="font-size-10">
                                                   {{$t('photo')}}
                                                   <v-icon left x-small >
                                                       mdi-camera-outline
                                                   </v-icon>
                                               </span>
                            </div>




                        </div>

                        <div v-if="reply_msg.type === 'file'">
                            <div class="pt-0 px-2">
                                <span class="reply_name">{{ reply_name}}</span>
                                <span class="font-size-10">
                                                   {{reply_msg.file_name}}
                                                   <v-icon left small>
                                                       mdi-paperclip
                                                   </v-icon>

                                               </span>
                            </div>



                        </div>

                    </div>

                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn
                            icon
                            @click="replyClose"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <v-card-title class="py-0 my-0">
                    <v-textarea
                        class="mt-0 pt-0"
                        v-model="text"
                        :label="$t('message')"
                        no-details
                        outlined
                        rows="3"
                        auto-grow
                        id="chat-message-typer-textarea"
                        :disabled="loading"
                        @keyup.enter="SentMessage()"
                        v-if="topic_active"
                        hide-details
                    >
                <template v-slot:append>
                    <v-icon class="pt-2" @click="document.getElementById('file').click()">mdi-paperclip </v-icon>
                </template>
            </v-textarea>

                    <v-btn icon class="ml-2"
                           v-if="topic_active"
                           :disabled="loading"
                     @click="SentMessage()">
                <v-icon dark>
                    mdi-send
                </v-icon>
            </v-btn>
                </v-card-title>
            </v-card>

        </v-footer>


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
                                    @click="deleteFile(document)"
                                >
                                    <v-icon>mdi-delete-outline</v-icon>
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

        <v-dialog
            v-model="dialog_answer"
            scrollable
            max-width="500px"
        >

            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                <v-card>
                    <v-card-title class="px-2 mx-0">
                        <v-icon @click="closeDialogAnswer">mdi-close</v-icon>
                        <span class="pl-5">{{ $t('confirm_payment') }}</span>


                    </v-card-title>
                    <v-divider></v-divider>


                    <v-card-text @drop.prevent="dragover_dialog = false"
                                 @dragover.prevent="dragover_dialog = true"
                                 @dragenter.prevent="dragover_dialog = true"
                                 @dragend.prevent="dragover_dialog = false">
                        <div class="mt-5 font-weight-bold">{{ $t('upload_title') }}</div>
                        <div class="my-1">{{ $t('upload_text_1') }}</div>
                        <div class="my-1">{{ $t('upload_text_2') }}</div>
                        <div class="my-1">{{ $t('upload_text_3') }}</div>
                        <div class="my-1">{{ $t('upload_text_4') }}</div>
                        <div class="my-2 pb-5" v-html="$t('upload_text_attention')"></div>

                        <div v-if="!answer_scanned_document.file_name">
                            <ValidationProvider ref="answer_scanned" rules="required"
                                                v-slot="{ errors, valid }">
                                <v-file-input  v-model="answer_scanned"
                                               accept=".pdf"
                                               outlined
                                               :error="!valid" :error-messages="errors"
                                               :disabled="loading"
                                               :label="$t('select_file_pdf')"
                                               class="mb-0 pb-0"
                                               @change="previewAnswerScanned"
                                ></v-file-input>
                            </ValidationProvider>
                        </div>
                        <div class="mt-0 pt-0" v-if="answer_scanned_document.file_name">
                            <v-list subheader >
                                <v-list-item class="px-0 mx-0"  @click="downloadFile(answer_scanned_document.url, answer_scanned_document.file_name)">
                                    <v-list-item-icon>
                                        <v-img
                                            max-width="90"
                                            :alt="answer_scanned_document.file_name"
                                            :src="answer_scanned_document.url"
                                            max-height="60"
                                        ></v-img>
                                        <v-icon
                                            x-large
                                            v-if="!mimeTypeImage(answer_scanned_document.file_type)">mdi-file-document-outline mdi-48px</v-icon>
                                    </v-list-item-icon>

                                    <v-list-item-content>
                                        <v-list-item-title v-text="answer_scanned_document.file_name"></v-list-item-title>
                                        <v-list-item-subtitle v-text="(answer_scanned_document.size / 1000).toFixed(1) + ' KB'"></v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-icon class="d-flex align-self-center mt-2">
                                        <v-btn
                                            icon
                                            @click="clearAnswerScanned"
                                        >
                                            <v-icon> mdi-delete-outline</v-icon>
                                        </v-btn>

                                    </v-list-item-icon>
                                </v-list-item>
                            </v-list>
                        </div>
                        <v-overlay :value="dragover_dialog" z-index="10" color="#244ba8">
                            <v-row>
                                <v-col @drop.prevent="dropFileDialog" style="height: 400px;width:500px;"


                                       class="grey darken-1"

                                >
                                    <v-col  style="height: 380px;width:490px; border: dashed 4px #fff;">

                                        <v-card
                                            height="350"
                                            class="pa-2 grey darken-1 align-self-center"
                                            elevation="0"

                                        >
                                            <v-col sm="12" class="text-center mt-10">
                                                <v-icon
                                                    left style="font-size: 150px"

                                                    class="text-center">
                                                    mdi-file-upload-outline
                                                </v-icon>
                                            </v-col>
                                            <v-col sm="12" class="text-center font-weight-bold h5">{{$t('drop_files_here_to_send_them')}}</v-col>


                                        </v-card>


                                    </v-col>
                                </v-col>
                            </v-row>


                        </v-overlay>

                    </v-card-text>

                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn

                            text
                            @click="closeDialogAnswer"
                        >
                            {{ $t('cancel')}}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="!answer_scanned_document.file_name || new_answer_scanned === 1"
                            color="primary"
                            text
                            @click="addInvoice"

                            :disabled="invalid || loading" :loading="loading"
                        >
                            {{$t('upload')}}
                        </v-btn>
                    </v-card-actions>


                </v-card>
            </ValidationObserver>

        </v-dialog>

        <v-dialog
            v-model="dialog_reject"
            scrollable

            max-width="500px"


        >
            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                <v-card>
                    <v-card-title class="px-2 mx-0">
                        <v-icon @click="dialogRejectClose">mdi-close</v-icon>
                        <span class="pl-5">{{ $t('confirm_reject') }}</span>


                    </v-card-title>
                    <v-divider></v-divider>


                    <v-card-text>
                        <ValidationProvider ref="administrator" rules="required|min:3|max:255"
                                            v-slot="{ errors, valid }">

                            <v-textarea
                                v-model="reject_text"
                                outlined
                                :label="$t('reason_for_rejection')"
                                :error="!valid" :error-messages="errors"
                                :disabled="loading"
                                clearable
                            ></v-textarea>
                        </ValidationProvider>

                    </v-card-text>


                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn

                            text
                            @click="dialogRejectClose"
                        >
                            {{ $t('cancel')}}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            text
                            @click="sendReject"

                            :disabled="invalid || loading" :loading="loading"
                        >
                            {{$t('sent')}}
                        </v-btn>
                    </v-card-actions>


                </v-card>
            </ValidationObserver>

        </v-dialog>


        <v-overlay :value="loadingMessages" z-index="10" color="#244ba8">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <v-overlay :value="dragover" z-index="10" color="#244ba8">
            <v-row>
                <v-col style="height: 400px;width:500px;"
                class="grey darken-1"
                       @drop.prevent="dropFile"
                >
                    <v-col style="height: 380px;width:490px; border: dashed 4px #fff;">

                            <v-card
                                height="350"
                                class="pa-2 grey darken-1 align-self-center"
                                elevation="0"

                            >
                                <v-col sm="12" class="text-center mt-10">
                                <v-icon
                                    left style="font-size: 150px"

                                        class="text-center">
                                    mdi-file-upload-outline
                                </v-icon>
                                </v-col>
                               <v-col sm="12" class="text-center font-weight-bold h5">{{$t('drop_files_here_to_send_them')}}</v-col>


                            </v-card>


                    </v-col>
                </v-col>
            </v-row>


        </v-overlay>




    </v-container>
</template>

<script>

import debounce from "lodash/debounce";
import {mapActions, mapGetters, } from "vuex";
import {ValidationObserver, ValidationProvider} from 'vee-validate'


export default {
    name: 'TopicForm',
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            dragover:false,
            dragover_dialog:false,
            toolbar_reply:false,
            reply_msg: {},
            reply_name: null,
            reply_uuid: null,
            loadingMessages: false,
            count_messages: 0,
            dialog_image_view:false,
            image_view: {},
            document,
            document_urls: [],
            dialog_file: false,
            files:[],
            documents:[],
            dialog_favorite_view: false,
            topic_name: '',
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
                { title: this.$t('reply'), click: "reply" },
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
            },
            avatars: [],
            dialog_answer:false,
            answer_scanned_document : {},
            answer_scanned : null,
            invoice_uuid : null,
            new_answer_scanned: 0,
            dialog_reject : false,
            reject_text : null,
            confirmed_item: null,
            confirmed_msg_uuid: null,
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
        await this.getAvatars();
        await this.listenChannelWebsocket2()
        document.body.scrollIntoView(false);

    },
    methods: {
        ...mapActions(['setUserName']),
        clientClick(data,msg_uuid){
            if(data.type && data.type !== ''){
                switch (data.type){
                    case 'confirm_invoice' : this.openDialog(data,msg_uuid); break;
                    case 'reject_invoice' : this.dialogRejectOpen(data, msg_uuid);  break;
                    case 'dialog_reject_document' : this.dialogRejectOpen(data, msg_uuid);  break;
                    case 'dialog_confirm_document' : this.sendConfirm(data, msg_uuid);  break;

                }
            }
            else{
                let route = {
                    "name" : data.name,
                    "params" : data.params,
                }
                this.$router.push(route);
            }

        },
        openDialog(data,msg_uuid){
            switch (data.name){
                case 'confirm_invoice':
                    this.confirmed_msg_uuid =  msg_uuid;
                    this.getInvoice(data.params.invoice_uuid)
                break;
            }
        },
        sendReject() {

            var formData = new FormData()
            var _this = this

            if (this.topic_uuid){
                formData.append('topic_uuid', this.topic_uuid)
            }

            if(this.confirmed_item && this.confirmed_item.params) {
                for (const [key, value] of Object.entries(this.confirmed_item.params)) {
                    formData.append(key, value);
                }
            }

            if(this.confirmed_item && this.confirmed_item.type && this.confirmed_item.type !== ''){
                formData.append('type', this.confirmed_item.type)
            }
            if (this.reject_text) {
                formData.append('reject_text', this.reject_text)
            }

            formData.append('confirmed', '0')

            this.$http
                .put(`client/message/confirmed/${this.confirmed_msg_uuid}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    for (const [key, value] of Object.entries(_this.chatMessagesDate)) {
                        value.forEach(function fn(item, index) {
                            if (item.uuid === _this.confirmed_msg_uuid) {
                                item.comment.confirmed = '0';
                                item.comment.confirmed_text = _this.reject_text;
                            }
                        });
                    }
                    _this.dialogRejectClose();
                })
                .catch(err => {
                    this.$toastr.error(this.$t('rejection_attempt_error'))
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


        },
        sendConfirm(data,msg_uuid) {

            var formData = new FormData()
            var _this = this

            if (this.topic_uuid){
                formData.append('topic_uuid', this.topic_uuid)
            }

            if(data && data.type && data.type !== ''){
                formData.append('type', data.type)
            }

            if(data && data.params) {
                for (const [key, value] of Object.entries(data.params)) {
                    formData.append(key, value)
                }
            }

            formData.append('confirmed', '1')

            this.$http
                .put(`client/message/confirmed/${msg_uuid}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    for (const [key, value] of Object.entries(_this.chatMessagesDate)) {
                        value.forEach(function fn(item, index) {
                            if (item.uuid === msg_uuid) {
                                item.comment.confirmed = '1';
                              //  item.comment.confirmed_text = _this.reject_text;
                            }
                        });
                    }
                    _this.dialogRejectClose();
                })
                .catch(err => {
                    this.$toastr.error(this.$t('acceptance_attempt_error'))
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


        },
        dialogRejectOpen(item,msg_uuid){
            this.dialog_reject  = true;
            this.confirmed_item =  item;
            this.confirmed_msg_uuid =  msg_uuid;
        },
        dialogRejectClose(){
            this.dialog_reject  = false;
            this.reject_text =  null;
            this.confirmed_item =  null;
            this.confirmed_msg_uuid =  null;
        },
        replyScroll(el){
            this.$scrollTo('#div_'+el);
        },
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

        dropFile(event){
            this.files = Array.from(event.dataTransfer.files);
            this.previewFiles();
        },
        dropFileDialog(event){
            this.answer_scanned = Array.from(event.dataTransfer.files)[0];
            if(this.answer_scanned.size > 50000000){
                alert('Файл: ' + this.answer_scanned.name + 'Больше 50 MB.')
            }
            else{
                this.previewAnswerScanned();
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
                case 'reply' :
                    this.replyOpen(msg)
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

        replyOpen(msg){
            this.reply_uuid = msg.uuid
            this.reply_msg = msg.comment;
            this.reply_name = msg.name;
            this.toolbar_reply = true
        },
        replyClose(){
            this.reply_uuid = null
            this.reply_name = null
            this.toolbar_reply = false
            this.reply_msg = {}
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
        previewFiles(){
            let i = this.document_urls.length
            let data = {}
            this.files.forEach((file) => {
                if(file.size < 50000000){
                    data = {}
                    data.id = i
                    data.url = URL.createObjectURL(file)
                    data.name = file.name
                    data.blob =  file
                    data.size = file.size
                    data.type = file.type
                    this.document_urls.push(data)
                    i++
                }
                else{
                    alert('Файл: ' + file.name + 'Больше 50 MB.')
                }

            })
            this.dialog_file = true
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
        },
        deleteFile(item){
            let index =  this.document_urls.indexOf(item)
            this.document_urls.splice(index, 1)
            if(this.document_urls.length === 0){
                this.dialog_file = false;
                this.document_urls=[];
                this.documents=[]
            }
        },

        listenChannelWebsocket2() {
            //console.log('ddddd' + `App.Models.Admin.${this.$auth.user().id}`)
            //console.log('ddddd' + `.Event.Chat.${this.topic_id}`)
            window.Echo
                .private(`App.Models.Client.${this.$auth.user().id}`)
                .listen(`.Event.Chat.${this.topic_id}`, (event) => {
                    //console.log(event)
                    //Если пришло добавление собщение
                    if(event && event.id && event.id > 0) {

                        if (event.comment && event.comment.type) {
                            if(event.comment.type === "manager"){
                                this.getAvatars();
                            }
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
                })
                .listen(`.Event.Chat.Update.${this.topic_id}`, (event) =>{
                    let msg_uuid = event.uuid
                    for (const [key, value] of Object.entries(this.chatMessagesDate)) {
                        value.forEach(function fn(item, index) {
                            if(item.uuid === msg_uuid){
                                item.comment = event.comment;
                            }


                        });
                    }

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


        async SentMessageFile() {
            var _this = this;
            let formData, blob;
            this.dialog_file = false;
            this.documents=[]
            let is_image = false;


            let id_array = 0;
            for (const file of this.document_urls) {

                let replyMessage = {}
                if (this.reply_uuid) {
                    if(this.reply_msg.type === 'text'){
                        replyMessage = {
                            "type":  this.reply_msg.type,
                            "name": this.reply_name,
                            "reply_uuid":  this.reply_msg.uuid,
                            "value": this.reply_msg.value,
                        }
                    }
                    else{
                        replyMessage = {
                            "type":  this.reply_msg.type,
                            "name": this.reply_name,
                            "reply_uuid":  this.reply_msg.uuid,
                            "value": this.reply_msg.value,
                            "size": this.reply_msg.size,
                            "type_mime": this.reply_msg.type_mime,
                            "file_type": this.reply_msg.file_type,
                            "file_name": this.reply_msg.file_name,
                        }
                    }

                }

                is_image = this.mimeTypeImage(file.type);
                if(this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')] === undefined) {
                    id_array = 1;
                    const newMessage = {
                        [this.$moment().format('YYYY-MM-DD')]:
                            [
                                {
                                    "id": Number(new Date().getTime()) + 1,
                                    "uuid": "uuid",
                                    "me": true,
                                    "comment": is_image ? {"type": "image", "value": file.url} : {"type": "file", "value": file.url, "file_name":file.name, "size":file.size},
                                    "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                                    "delivered": false,
                                    "name": this.$auth.user().name,
                                    "reply": replyMessage
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
                        "comment": is_image ? {"type": "image", "value": file.url} : {"type": "file", "value": file.url, "file_name":file.name, "size":file.size},
                        "created_at": this.$moment().tz(this.timezone).format('YYYY-MM-DD HH:mm'),
                        "delivered": false,
                        "name": this.$auth.user().name,
                        "reply": replyMessage
                    });
                }

                formData = new FormData();
                if (this.reply_uuid) {
                    formData.append('reply_uuid', this.reply_uuid)
                }
                formData.append('id_array', id_array)
                formData.append('topic_uuid', this.topic_uuid)
                formData.append('type_mime', file.type)
                formData.append('size', file.size)
                formData.append('file_name', file.name)
                formData.append('is_image', is_image ? 1 : null)
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
            this.replyClose()
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
            if (this.reply_uuid) {
                formData.append('reply_uuid', this.reply_uuid)
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

                    let replyMessage = {}
                    if (this.reply_uuid) {
                        if(this.reply_msg.type === 'text'){
                            replyMessage = {
                                "type":  this.reply_msg.type,
                                "name": this.reply_name,
                                "reply_uuid":  this.reply_msg.uuid,
                                "value": this.reply_msg.value,
                            }
                        }
                        else{
                            replyMessage = {
                                "type":  this.reply_msg.type,
                                "name": this.reply_name,
                                "reply_uuid":  this.reply_msg.uuid,
                                "value": this.reply_msg.value,
                                "size": this.reply_msg.size,
                                "type_mime": this.reply_msg.type_mime,
                                "file_type": this.reply_msg.file_type,
                                "file_name": this.reply_msg.file_name,
                            }
                        }

                    }

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
                                        "reply": replyMessage
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
                            "reply": replyMessage
                        });
                    }
                    this.text = ''
                    this.count_messages++;
                    this.replyClose();
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
        async getAvatars() {
            this.loading = true;
            let params = {};
            params.topic_uuid = this.topic_uuid;

            await this.$http
                .get("client/topic_avatars", {
                    params: params,
                })
                .then(res => {
                    this.avatars = res.body.data.avatars
                })
                .catch(err => {
                    this.avatars = []
                    this.$toastr.error(this.$t('failed_to_get_list_avatars'))
                })
                .finally(end => {
                    this.loading = false
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
        async getInvoice(invoice_uuid) {
            var _this = this;
            this.loadingMessages = true;

            let params = {};


            await this.$http
                .get(`client/invoice/${invoice_uuid}`, {
                    params: params,
                    progress(e) {
                        if (e.lengthComputable) {
                            _this.progress = Math.round((e.loaded / e.total) * 100)
                        }
                    }
                })
                .then(res => {
                    this.answer_scanned_document = res.body.data.answer_scanned ?? {}
                    this.dragover_dialog  = false;
                    this.dialog_answer  = true;
                    this.invoice_uuid = res.body.data.uuid;
                })
                .catch(err => {
                    this.invoices = []
                    this.totalInvoices = 0
                    this.$toastr.error(this.$t('failed_to_get_invoice'))
                })
                .finally(end => {
                    this.progress = 0
                    this.loadingMessages = false
                })
        },
        async addInvoice(){
            var _this = this;
            this.progress = 0
            this.loading = true
            var formData = new FormData()

            if (this.confirmed_msg_uuid) {
                formData.append('message_uuid', this.confirmed_msg_uuid)
            }


            if (this.topic_uuid){
                formData.append('topic_uuid', this.topic_uuid)
            }

            let id_array = this.chatMessagesDate[this.$moment().format('YYYY-MM-DD')].length + 1;
            formData.append('id_array', id_array)

            if (this.new_answer_scanned) {
                formData.append('new_answer_scanned', 1)
            }

            if (this.answer_scanned_document.size) {
                formData.append('answer_size', this.answer_scanned_document.size)
            }
            if (this.answer_scanned_document.file_name) {
                formData.append('answer_file_name', this.answer_scanned_document.file_name)
            }
            if (this.answer_scanned_document.file_type) {
                formData.append('answer_file_type', this.answer_scanned_document.file_type)
            }
            if (this.answer_scanned) {
                formData.append('answer_scanned', this.answer_scanned)
            }


            await this.$http
                .put(`client/invoice/${this.invoice_uuid}`, formData, {
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
                    this.$toastr.success(this.$t('invoice_has_been_updated'))
                    _this.closeDialogAnswer();
                })
                .catch(err => {
                    this.$toastr.error(this.$t('invoice_has_not_been_updated'))
                    if (err && err.body && err.body.message) {
                        for (let prop in err.body.errors) {
                            _this.clearAnswerScanned();
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
        closeDialogAnswer(){
            this.dialog_answer = false;
            this.dragover_dialog = false;
            this.answer_scanned_document={};
            this.answer_scanned=null;
            this.new_answer_scanned = 0;
            this.invoice_uuid = null;
            this.confirmed_msg_uuid = null;
        },
        previewAnswerScanned() {
            let document = this.answer_scanned;
            this.answer_scanned_document = {}
            this.answer_scanned_document.url = URL.createObjectURL(document)
            this.answer_scanned_document.file_name = document.name
            this.answer_scanned_document.blob =  document
            this.answer_scanned_document.size = document.size
            this.answer_scanned_document.file_type = document.type
            this.new_answer_scanned = 1;
        },
        clearAnswerScanned(){
            this.answer_scanned  = null
            this.answer_scanned_document  = {}

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
.reply{
    border-left: solid 2px #403e3e;
}
.reply_client
{
    color: #000;
    margin-bottom:10px;
    padding:0;
    background-color:#d2d5d6;
    border-left: solid 2px #403e3e;

}
.reply_me
{
    color: #fff;
    margin-bottom: 10px;
    padding:0;
    background-color: #263b99;
    border-left: solid 2px #fff;



}
.overflow_hide{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 424px;

}
.reply_name{
    display: block;
    font-size: 12px;
    line-height: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.font-size-10{
    font-size: 10px;
}
.name{
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

.avatars {
    display: inline-block;
    transform: scale(-1, 1);
}

.avatar {
    position: relative;
    display: inline-block;
    overflow: hidden;
    width: 100px;
}

.avatar:not(:first-child) {
    margin-left: -75px;
}

.avatar img {
    width: 100%;
    display: block;
    transform: scale(-1, 1);
}
.avatar_border{
  background-color: #fff;
}

.avatar img:hover{
    z-index: 1;
    border: solid 1px #fff;
}


</style>

<style>
.toolbar_padding_0 .v-toolbar__content{
    padding: 0 !important;
    margin: 0 !important;
}
</style>








