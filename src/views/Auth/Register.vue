<template>
    <v-container :class="!$vuetify.breakpoint.xsOnly ? 'pb-15' : ''">
        <v-row>
            <v-col cols="12">
                <transition name="fade">
                    <v-card elevation="0"
                            class="background_color_transparent"
                    >
                        <v-form @submit.prevent="registerClient">
                            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" class="text_hello my-0 py-1">
                                            {{$t('hello')}}
                                        </v-col>
                                        <v-col cols="12" class="title_login py-0 my-0">
                                            {{ $t('hey_lets_registered')}}
                                        </v-col>

                                        <v-col cols="12" sm="12" lg="12" xl="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('your_name')}}</label>
                                            <ValidationProvider ref="name" rules="required|min:1|max:50"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="name"
                                                              type="text"
                                                              :error-messages="errors"
                                                              prepend-inner-icon="mdi-account-outline "
                                                              :hide-details="(valid || name=== null)"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :disabled="loading"
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                              clearable
                                                              required
                                                ></v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" sm="6" lg="6" xl="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('phone')}}</label>
                                            <ValidationProvider ref="phone" rules="required|phone"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="phoneRaw"
                                                              type="tel"
                                                              v-mask="['+# (###) ###-##-##', '+### (##) ###-##-##' , '+### (###) ###-##-##']"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              prepend-inner-icon="mdi-phone-outline"
                                                              :hide-details="(valid || phone=== null)"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                              clearable
                                                >
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" sm="6" lg="6" xl="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('email')}}</label>
                                            <v-text-field v-model="email"
                                                          disabled
                                                          type="email"
                                                          hide-details="true"
                                                          outlined
                                                          solo
                                                          flat
                                                          dense
                                                          :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                          color="primary"
                                                          :label="$t('email')"
                                                          class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                            >
                                                <template slot="prepend-inner">
                                                    <v-icon size="20">${{'emailIcon'}}</v-icon>
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" lg="6" xl="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('enter_password')}}</label>
                                            <ValidationProvider ref="password" rules="required|min:8|max:30" vid="password"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="password" :disabled="loading"
                                                              :type="passwordHidden ? 'password' : 'text'"
                                                              :error-messages="errors"
                                                              :hide-details="(valid || password=== null)"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                              required
                                                >
                                                    <template slot="append">
                                                        <v-btn icon @click="() => (passwordHidden = !passwordHidden)">
                                                            <v-icon :size="$vuetify.breakpoint.xsOnly ? 28 : 22">${{passwordHidden ? 'eyeOffIcon' : 'eyeIcon'}}</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <template slot="prepend-inner">
                                                        <v-icon :size="$vuetify.breakpoint.xsOnly ? 24 : 18">${{'lockIcon'}}</v-icon>
                                                    </template>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" sm="6" lg="6" xl="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('repeat_password')}}</label>
                                            <ValidationProvider ref="confirmation_password" rules="required_if:password|confirmed:password"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="password_confirmation"
                                                              :disabled="loading"
                                                              :type="passwordConfirmHidden ? 'password' : 'text'"
                                                              :error-messages="errors"
                                                              :hide-details="(valid || password_confirmation=== null)"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 rounded-lg input_text"
                                                              required>
                                                    <template slot="append">
                                                        <v-btn icon @click="() => (passwordConfirmHidden = !passwordConfirmHidden)">
                                                            <v-icon :size="$vuetify.breakpoint.xsOnly ? 28 : 22">${{passwordConfirmHidden ? 'eyeOffIcon' : 'eyeIcon'}}</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <template slot="prepend-inner">
                                                        <v-icon :size="$vuetify.breakpoint.xsOnly ? 24 : 18">${{'lockIcon'}}</v-icon>
                                                    </template>

                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" class="pt-5 pb-0">
                                            <ValidationProvider ref="personal_data" rules="required|boolean"
                                                                v-slot="{ errors, valid }">
                                                <v-checkbox v-model="personal_data" class="pt-0 mt-0"
                                                            :error-messages="errors"
                                                            hide-details

                                                            :disabled="loading" >
                                                    <template v-slot:label>
                                                        <div class="title_login" style="text-align: left">
                                                            {{ $t('consent_to_the_collection_and_processing_of_personal_data') }} (
                                                            <v-tooltip location="bottom">
                                                                <template v-slot:activator="{ props }">
                                                                    <a
                                                                        v-bind="props"
                                                                        @click="page_dialog=true"
                                                                    >
                                                                        {{ $t('contract') }}
                                                                    </a>
                                                                </template>

                                                            </v-tooltip>
                                                            )
                                                        </div>
                                                    </template>
                                                </v-checkbox>
                                            </ValidationProvider>
                                        </v-col>
                                    </v-row>
                                    <v-row  v-if="step === 2 ">
                                        <v-col cols="12" sm="6" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('enter_sms_code')}}</label>
                                            <ValidationProvider ref="code" rules="required|min:4|max:4"
                                                                v-slot="{ errors, valid }">
                                                <v-otp-input

                                                    v-model="code"
                                                    length="4"
                                                    :error-messages="errors"
                                                    dense
                                                    :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                    :disabled="loading"
                                                    prepend-icon="mdi-name"
                                                    class="rounded-lg but_enter"

                                                ></v-otp-input>

                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" sm="6" class="mt-5 pt-5 d-flex justify-end" >
                                            <v-btn
                                                :loading="loading"
                                                :disabled="loading || invalid || !validated"
                                                variant="flat"
                                                color="primary"
                                                class="rounded-lg but_enter"
                                                :style="!$vuetify.breakpoint.xsOnly ? 'min-width: 180px !important;margin-top: 2px !important;' : ''"

                                                :block="$vuetify.breakpoint.xsOnly"
                                                :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                @click="registerCompany"
                                            >
                                                {{ $t('register') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" class="pt-5 pb-0">
                                                <v-btn v-if="!sender_client_id  && step === 1"
                                                       :loading="loading"
                                                       :disabled="loading || invalid || !validated"
                                                       variant="flat"
                                                       color="primary"
                                                       class="rounded-lg but_enter"
                                                       :block="$vuetify.breakpoint.xsOnly"
                                                       :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                       @click="getCode"
                                                >
                                                    {{ $t('next') }}
                                                </v-btn>
                                                <v-btn v-if="sender_client_id"
                                                       :loading="loading"
                                                       :disabled="loading || invalid || !validated"
                                                       variant="flat"
                                                       color="primary"
                                                       class="rounded-lg but_enter"
                                                       width="190px !important"
                                                       :block="$vuetify.breakpoint.xsOnly"
                                                       :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                       @click="registerClient()"
                                                >
                                                    {{ $t('register') }}
                                                </v-btn>

                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </ValidationObserver>
                        </v-form>
                    </v-card>

                </transition>
            </v-col>
        </v-row>
        <v-dialog
            v-model="page_dialog"
            :fullscreen = "($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly)"
            persistent
            hide-overlay
            transition="dialog-bottom-transition"
            max-width="600px"
        >
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ page_title }}</span>
                </v-card-title>
                <v-card-text v-html="page_text">

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey darken-5"
                        text
                        @click="personal_data=false; page_dialog = false;"
                    >
                        {{ $t('disagree') }}
                    </v-btn>
                    <v-btn
                        color="primary darken-5"
                        text
                        @click="personal_data=true; page_dialog = false;"
                    >
                        {{ $t('accept') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>

    import {mapGetters} from "vuex"
    import {ValidationObserver, ValidationProvider} from "vee-validate"
    import {mask} from 'vue-the-mask'

    export default {
        name: "Register",
        directives: {
            mask
        },
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                step: 1,
                loading: false,
                progress: 0,
                sender_client_id: null,
                name: null,
                company: null,
                address_legal: null,
                address_actually: null,
                bin_iin: null,
                property: null,
                propertyItems: [],
                code: null,
                email: null,
                phoneRaw: null,
                password: null,
                passwordHidden: true,
                password_confirmation: null,
                passwordConfirmHidden: true,
                personal_data: false,

                invite: {},
                languageUser: null,
                page_title: null,
                page_text: null,
                page_dialog: false
            };
        },
        computed: {
            ...mapGetters(['lang']),
            phone: function () {
                return this.changePhone(this.phoneRaw)
            },
        },
        mounted() {
            this.languageUser = this.lang
            this.getInvite()
            this.getFormProperties()
            this.getUserAgreement()


        },
        methods: {
            setLang(langSelect) {
                let langLocale = localStorage.getItem('lang')
                document.documentElement.lang = langSelect ? langSelect : (langLocale ? langLocale : process.env.VUE_APP_I18N_LOCALE)
                if (typeof this.$i18n.locale !== 'undefined') {
                    this.$i18n.locale = document.documentElement.lang
                }
                this.$moment.locale(this.$i18n.locale)
                if (typeof this.$vuetify.lang.current !== 'undefined') {
                    this.$vuetify.lang.current = document.documentElement.lang
                }
            },
            clear() {
                this.email = this.password = null;
                requestAnimationFrame(() => {
                    this.$refs.observ.reset();
                });
            },
            async registerClient() {
                var _this = this
                this.loading = true;
                await this.$auth
                    .register({
                        body: {
                            language: this.languageUser,
                            uuid: this.$route.params.uuid,
                            name: this.name,
                            email: this.email,
                            phone: this.phone,
                            personal_data: this.personal_data,
                            password: this.password,
                            password_confirmation: this.password_confirmation,
                            sender_client_id: this.sender_client_id,
                            // code: this.code,
                            // company: this.company,
                            // bin_iin: this.bin_iin,
                            // property: this.property,
                            // address_legal: this.address_legal,
                            // address_actually: this.address_actually,
                        },
                        fetchUser: true
                    })
                    .then(res => {
                        if (this.$auth.check() && this.$auth.user() && this.$auth.user().settings) {
                            this.$store.dispatch('setSettings', this.$auth.user().settings)
                        }
                        this.$toastr.success(this.$t('you_have_successfully_logged_in'));
                    })
                    .catch(err => {
                        if (err && err.status !== 503) {
                            this.$toastr.error(this.$t('you_entered_the_wrong_data'));
                        }
                        if (err && err.body && err.body.message) {
                            if (err && err.status === 503) {
                                this.$toastr.error(this.$t('the_service_is_temporarily_unavailable_please_try_again_later'), this.$t('maintenance_mode'));
                            } else {
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
                        }
                    });
                this.loading = false;
            },
            async registerCompany() {
                this.loading = true;
                this.progress = 0
                var _this = this;
                var formData = new FormData()

                if (this.phone) {
                    formData.append('phone', this.phone)
                }
                if (this.phone) {
                    formData.append('language', this.languageUser)
                }
                if (this.sender_client_id) {
                    formData.append('sender_client_id', this.sender_client_id)
                }
                if (this.$route.params.uuid) {
                    formData.append('uuid', this.$route.params.uuid)
                }
                if (this.name) {
                    formData.append('name', this.name)
                }
                if (this.email) {
                    formData.append('email', this.email)
                }
                if (this.phone) {
                    formData.append('phone', this.phone)
                }
                if (this.personal_data) {
                    formData.append('personal_data', this.personal_data)
                }
                if (this.password) {
                    formData.append('password', this.password)
                }
                if (this.password_confirmation) {
                    formData.append('password_confirmation', this.password_confirmation)
                }
                if (this.password_confirmation) {
                    formData.append('code', this.code)
                }

                await this.$http
                    .post(`auth/client/register`, formData, {
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
                        if(res.data && res.data.data && res.data.data.topic_uuid){
                            this.$router.push({
                                name: 'company.edit',
                                params: {
                                    uuid: res.data.data.topic_uuid
                                }
                            })
                        }
                        this.$toastr.success(this.$t('you_have_successfully_logged_in'));
                    })
                    .catch(err => {
                        if (err && err.status !== 503) {
                            this.$toastr.error(this.$t('you_entered_the_wrong_data'));
                        }
                        if (err && err.body && err.body.message) {
                            if (err && err.status === 503) {
                                this.$toastr.error(this.$t('the_service_is_temporarily_unavailable_please_try_again_later'), this.$t('maintenance_mode'));
                            } else {
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
                        }
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    });
            },
            async getInvite() {
                let params = {};

                params.uuid = this.$route.params.uuid;
                await this.$http
                    .get(`client/invite/${params.uuid}`, {
                        params: params,
                    })
                    .then(res => {
                        this.invite = res.body.data
                        this.email = this.invite.email
                        this.sender_client_id = this.invite.sender_client_id
                    })
                    .catch(err => {
                        this.invite = {};
                        this.$toastr.error(this.$t('failed_to_get_invite'))
                        this.$router.push({
                            name: "login"
                        });
                    });
            },
            async getFormProperties() {
                let params = {};
                params.filter = 'all';
                await this.$http
                    .get(`client/property`, {
                        params: params,
                    })
                    .then(res => {
                        this.propertyItems = res.body.data
                    })
                    .catch(err => {
                        this.propertyItems = [];
                        this.$toastr.error(this.$t('failed_to_get_list_properties'))
                    });
            },
            async getCode() {
                this.loading = true;
                this.progress = 0
                var _this = this;
                var formData = new FormData()

                if (this.phone) {
                    formData.append('phone', this.phone)
                }

                await this.$http
                    .post(`auth/client/get_code`, formData, {
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
                        _this.step = 2;
                    })
                    .catch(err => {
                        if (err && err.body && err.body.message) {
                            if (err && err.status === 503) {
                                this.$toastr.error(this.$t('the_service_is_temporarily_unavailable_please_try_again_later'), this.$t('maintenance_mode'));
                            } else {
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
                        }
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    });
            },
            async checkCode() {
                this.loading = true;
                this.progress = 0
                var _this = this;
                var formData = new FormData()

                if (this.phone) {
                    formData.append('phone', this.phone)
                }
                if (this.code) {
                    formData.append('code', this.code)
                }

                await this.$http
                    .post(`auth/client/check_code`, formData, {
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
                        _this.step = 3;
                    })
                    .catch(err => {
                        if (err && err.body && err.body.message) {
                            if (err && err.status === 503) {
                                this.$toastr.error(this.$t('the_service_is_temporarily_unavailable_please_try_again_later'), this.$t('maintenance_mode'));
                            } else {
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
                        }
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    });
            },
            async getUserAgreement(){
                let params = {};
                await this.$http
                    .get(`client/page/user-agreement`, {
                        params: params,
                    })
                    .then(res => {
                        this.page_title = res.body.data.title
                        this.page_text = res.body.data.text
                    })
                    .catch(err => {
                        this.invite = {};
                        this.$toastr.error(this.$t('failed_to_get_page'))
                    });
            }
        }
    }
</script>


