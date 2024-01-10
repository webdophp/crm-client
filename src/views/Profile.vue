<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 title_header">
                {{ $t('profile') }}
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" class="profile_background rounded-lg">
                <v-form @submit.prevent="saveClient">
                    <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                        <v-card flat class="background_color_transparent">
                            <v-card-text class="px-0 mx-0">
                                <v-row>
                                    <v-col cols="12" xl="3" sm="4" class="pb-5" :class="(!$vuetify.breakpoint.xsOnly) ? 'py-0 my-0' : ''">
                                        <make-avatar :style="!($vuetify.breakpoint.xsOnly) ? 'max-width: 212px' : 'max-width: 100%'" v-model="photo" aspect-ratio="1"/>
                                    </v-col>
                                    <v-col cols="12" xl="9" sm="8" >
                                        <v-row>
                                            <v-col class="py-0 mt-1" cols="12">
                                                <label class="input_label">{{$t('client_name')}}</label>
                                                <ValidationProvider ref="name" rules="min:3|max:255"
                                                                    v-slot="{ errors, valid }">
                                                    <v-text-field v-model="name"
                                                                  type="text"
                                                                  :error="!valid"
                                                                  :error-messages="errors"
                                                                  :disabled="loading"
                                                                  :hide-details="(valid || name=== null)"
                                                                  outlined
                                                                  solo
                                                                  flat
                                                                  dense
                                                                  :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                                  color="red"
                                                                  class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                                  clearable>
                                                    </v-text-field>
                                                </ValidationProvider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" xl="8" sm="7"  class="py-0 mt-3" >
                                                <label class="input_label">{{$t('phone')}}</label>
                                                <v-text-field v-model="phoneRaw" type="tel"
                                                              v-mask="['+# (###) ###-##-##', '+## (###) ###-##-##', '+### (###) ###-##-##']"
                                                              hide-details
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="red"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                              clearable disabled readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" xl="4" sm="5"  class="py-0 mt-3">
                                                <label class="input_label">{{$t('language_interface')}}</label>
                                                <ValidationProvider ref="languageUser" rules="min:1"
                                                                    v-slot="{ errors, valid }">
                                                <v-select v-model="languageUser" :items="listLanguageNames" :disabled="loading"
                                                          item-text="name"
                                                          item-value="id"
                                                          :hide-details="(valid || languageUser=== null)"
                                                          outlined
                                                          solo
                                                          flat
                                                          dense
                                                          :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                          color="red"
                                                          class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                          clearable></v-select>
                                                </ValidationProvider>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="py-0 mt-3" cols="12" xl="8" sm="7">
                                                <label class="input_label">{{$t('Email')}}</label>
                                                <ValidationProvider ref="email" rules="email|min:5|max:50"
                                                                    v-slot="{ errors, valid }">
                                                    <v-text-field v-model="email" type="email" :error-messages="errors"
                                                                  :disabled="loading" :error="!valid"
                                                                  :hide-details="(valid || email=== null)"
                                                                  outlined
                                                                  solo
                                                                  flat
                                                                  dense
                                                                  :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                                  color="red"
                                                                  class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                                  clearable disabled readonly>
                                                    </v-text-field>
                                                </ValidationProvider>
                                            </v-col>
                                            <v-col class="py-0 mt-3" cols="12" xl="4" sm="5">

                                                <v-btn type="submit" :disabled="invalid || loading" :loading="loading"
                                                       color="primary"
                                                       class="rounded-lg but_enter mt-4"
                                                       block
                                                       :height="$vuetify.breakpoint.xsOnly ? 45 : 35">
                                                    {{ $t('save') }}
                                                </v-btn>
                                            </v-col>

                                        </v-row>
                                    </v-col>
                                </v-row>

                            </v-card-text>
                        </v-card>
                    </ValidationObserver>
                </v-form>

            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12">
                <v-row class="pt-4 " v-if="can(['client'])">
                    <v-col cols="12" class="cursor-pointer" @click="dialogAdd=true">
                        <v-icon class="cursor-pointer color_B3B3B3" size="28">${{'accountPlusIcon'}}</v-icon>
                        <span  class="profile_text_add">{{ $t('add_employee')}}</span>

                    </v-col>
                </v-row>


                <v-row class="pt-4" v-if="invites.length > 0 && can(['client'])">
                    <v-col cols="12" class="title_header">{{ $t('you_gave_access')}}</v-col>
                </v-row>
                <v-row class="my-0 py-0" v-if="can(['client'])">
                    <v-col :cols="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly) ? 12 : 6"
                           v-for="(item, i) in invites"
                           :key="i">
                        <v-card
                            outlined
                            class="background_color_transparent rounded-lg"
                        >
                            <v-list-item >
                                <v-list-item-content>
                                    <div class="profile_text mb-4">
                                        {{  item.sent_date ? $moment(item.sent_date).format('DD.MM.YYYY') : $t('no_data')}}
                                    </div>
                                    <v-list-item-title class="profile_title_add mb-1">
                                        {{ item.client.name ? item.client.name : $t('not_accepted_yet') }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="profile_text">
                                        {{ item.client.email ? item.client.email : $t('not_accepted_yet') }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-avatar

                                    size="68" class="border1_B3B3B3"
                                >
                                    <img v-if="item.client.photo " :src="item.client.photo ? item.client.photo : defaultAvatar" >
                                    <v-icon v-else  size="40" class="color_B3B3B3">
                                        ${{'settingsIcon'}}
                                    </v-icon>

                                </v-list-item-avatar>
                            </v-list-item>

                            <v-card-actions>
                                <v-btn

                                    outlined
                                    :disabled="loading" :loading="loading"
                                    color="primary"
                                    class="rounded-lg but_enter mt-4"

                                    :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                    @click="deleteInvite(item)"
                                >
                                    {{ $t('delete') }}
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>

                        </v-card>
                    </v-col>


                    <v-col v-if="false" :cols="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly) ? 12 : 6"
                           @click="dialogAdd=true"
                    >
                        <v-card
                            outlined
                        >
                            <v-container class="fill-height pt-12 pb-0 justify-center"  >
                                <v-icon class="block">mdi-account-multiple-plus-outline mdi-48px</v-icon>
                            </v-container>
                            <v-card-title class=" justify-center pt-0 pb-11">{{ $t('add_employee')}}</v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>




        <v-overlay :value="loading" z-index="10" color="#244ba8">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>


        <v-dialog v-if="dialogAdd" v-model="dialogAdd"
                  transition="dialog-bottom-transition"
                  width="500">

            <v-form @submit.prevent="sentInvite"  v-if="can(['client'])" >
                <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">

                    <v-card>


                        <v-card-title>
                            {{ $t('send_invitation') }}
                        </v-card-title>
                        <v-card-subtitle class="pt-3"> {{ $t('send_invitation_text1') }}</v-card-subtitle>
                        <v-card-subtitle class="font-weight-bold py-0"> {{ $t('send_invitation_text2') }}</v-card-subtitle>
                        <v-card-text class="my-2 py-2">
                            <v-col class="py-0" cols="12">
                                <ValidationProvider ref="email_add" rules="required|email|min:5|max:50"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="email_add" type="email"
                                                  :error-messages="errors" :error="!valid"
                                                  :disabled="loading"
                                                  outlined
                                                  prepend-inner-icon="mdi-email"
                                                  label="Email"
                                                  color="primary" clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="darken-1" text @click="closeDialogAdd()">
                                {{ $t('cancel')}}
                            </v-btn>
                            <v-btn color="primary"
                                   :disabled="invalid || loading" :loading="loading"
                                   text type="submit">
                                {{ $t('sent')}}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </ValidationObserver>
            </v-form>
        </v-dialog>

    </v-container>
</template>
<script>

    import {ValidationObserver, ValidationProvider} from 'vee-validate'
    import {mask} from 'vue-the-mask'
    import MakeAvatar from '../components/MakeAvatar.vue'
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: 'ClientProfile',
        directives: {
            mask,
        },
        components: {
            ValidationProvider,
            ValidationObserver,
            MakeAvatar,
        },
        inject: ['forceRerender'],
        data() {
            return {
                progress: 0,
                phoneRaw: null,
                name: null,
                email: null,
                languageUser: null,
                loading: false,
                loadingCities: false,
                photo: null,
                email_add: null,
                invites: [],
                sortBy: "id",
                sortDir: false,
                page: 1,
                pageCount: 0,
                perPage: 25,
                totalInvites: 0,
                dialogAdd: false,

            }
        },
        computed: {
            ...mapGetters(['listLanguages', 'listLanguageNames', 'lang', 'phoneMask', 'defaultAvatar']),
            phone: function () {
                return this.changePhone(this.phoneRaw)
            },
        },
        mounted() {
           this.getClient(0)
           this.getInvites()
        },
        methods: {
            ...mapActions(['setUserName', 'setLanguage',  'setUserPosition', 'setUserAvatar']),
            async getClient(id) {
                var _this = this;
                this.progress = 0
                this.loading = true
                this.id = id
                await this.$http
                    .get(`client/profile/0`, {
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.name = res.body.data.name
                        this.phoneRaw = res.body.data.phone
                        this.email = res.body.data.email
                        this.photo = res.body.data.photo
                        this.languageUser = res.body.data.language ? res.body.data.language : this.lang
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_client'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async saveClient() {

                    var _this = this;
                    this.progress = 0
                    this.loading = true
                    var formData = new FormData()
                    if (this.name) {
                        formData.append('name', this.name)
                    }
                    if (this.languageUser) {
                        formData.append('language', this.languageUser)
                    }


                    if (this.photo) {
                        if (this.photo.length > 250) {
                            var mimeType = this.getMimeType(this.photo)
                            var blob = this.dataURL64toBlob(this.photo)
                            if (mimeType && blob) {
                                formData.append('photo', blob, mimeType)
                            }
                        } else {
                            formData.append('photo', this.photo)
                        }
                    }

                    await this.$http
                        .put(`client/profile/0`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            progress(e) {
                                if (e.lengthComputable) {
                                    _this.progress = Math.round((e.loaded / e.total) * 100)
                                }
                            }
                        })
                        .then(async res => {

                            this.$auth.fetch()
                                .then(res => {
                                    this.setUserName(this.$auth.user().name)
                                    this.setUserPosition(this.$auth.user().position)
                                    this.setUserAvatar((this.$auth.user().photo ? this.$auth.user().photo : this.defaultAvatar))
                                    _this.setLang()
                                    this.$toastr.success(this.$t('client_has_been_updated'))
                                })
                        })
                        .catch(err => {
                            this.$toastr.error(this.$t('client_has_not_been_updated'))
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
                this.forceRerender()
            },


            closeDialogAdd() {
                this.email_add = null
                this.dialogAdd = false;
            },
            async getInvites() {
                this.loading = true;
                let params = {};
                params.page = 1
                params.sortBy = this.sortBy;
                params.sortDir = this.sortDir ? 'asc' : 'desc';
                params.perPage = this.perPage;

                await this.$http
                    .get("client/invite", {
                        params: params,
                    })
                    .then(res => {
                        this.invites = res.body.data
                        this.page = res.body.meta.current_page
                        this.totalInvites = res.body.meta.total
                        this.pageCount = res.body.meta.last_page


                    })
                    .catch(err => {
                        this.invites = []
                        this.totalInvites = 0
                        this.$toastr.error(this.$t('failed_to_get_list_invites'))
                    })
                    .finally(end => {
                        this.loading = false
                    })
            },
            async sentInvite() {
                var _this = this;
                this.progress = 0
                this.loading = true
                var formData = new FormData()

                if (this.email_add) {
                    formData.append('email', this.email_add)
                }

                // Add
                await this.$http
                    .post('client/invite', formData, {
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
                        this.$toastr.success(this.$t('invite_has_been_added'))
                        this.dialogAdd = false;
                        this.email_add = null;
                        this.getInvites();
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('invite_has_not_been_added'))

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
            async deleteInvite(item) {
                if (confirm(this.$t('delete_invite'))) {
                    var _this = this
                    this.loading = true;
                    await this.$http
                        .delete(`client/invite/${item.id}`)
                        .then(res => {
                            this.$toastr.success(this.$t('invite_has_been_deleted'))
                            this.getInvites()
                        })
                        .catch(err => {
                            this.$toastr.error(this.$t('invite_has_not_been_deleted'))
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
        }
    }
</script>
