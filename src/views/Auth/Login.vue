<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <transition name="fade">
                    <v-card elevation="0"
                            class="background_color_transparent"
                    >

                        <v-form @submit.prevent="submit">
                            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" class="text_hello my-0 py-1">
                                            {{$t('hello')}}

                                        </v-col>
                                        <v-col cols="12" v-show="email_show"  class="title_login py-0 my-0" v-html="$t('hey_lets_start_with_your_email')"></v-col>
                                        <v-col cols="12" v-show="!email_show" class="title_login py-0 my-0" v-html="$t('hey_lets_start_with_your_phone')"></v-col>
                                        <v-col cols="12" class="py-0 my-0 position-static" v-if="false">
                                            <div class="tumbler">
                                                <a href="javascript:void(0)"  @click="changeField()">
                                                    <span v-show="email_show"> {{$t('sign_in_with_phone_number')}}</span>
                                                    <span v-show="!email_show">{{$t('sign_in_with_email')}}</span>
                                                </a>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" class="pt-5 pb-0" v-show="email_show">
                                            <label v-if="false" class="input_label">{{$t('email')}}</label>
                                            <ValidationProvider ref="email"
                                                                :rules="email_required + 'email|min:5|max:50'"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="email"
                                                              type="email"
                                                              :error-messages="errors"
                                                              :hide-details="(valid || email=== null)"
                                                              :disabled="loading"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable
                                                              >

                                                    <template slot="prepend-inner">
                                                        <v-icon :size="$vuetify.breakpoint.xsOnly ? 24 : 18">${{'emailIcon'}}</v-icon>
                                                    </template>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" class="pt-5 pb-0" v-show="!email_show">
                                            <label v-if="false" class="input_label">{{$t('phone')}}</label>
                                            <ValidationProvider ref="phoneRaw"
                                                                :rules="phone_required + 'phone'"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="phoneRaw"
                                                              type="tel"
                                                              v-mask="['+# (###) ###-##-##', '+## (###) ###-##-##', '+### (###) ###-##-##']"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable
                                                              prepend-inner-icon="mdi-phone-outlined"
                                                              :label="$t('phone')"
                                                              >
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" class="pt-5 pb-0">
                                            <label v-if="false" class="input_label">{{$t('password')}}</label>
                                            <ValidationProvider ref="password" rules="required|min:8|max:30"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="password" :error-messages="errors"
                                                      :type="passwordHidden ? 'password' : 'text'"
                                                      :disabled="loading"
                                                      :hide-details="(valid || password=== null)"
                                                      outlined
                                                      solo
                                                      flat
                                                      dense
                                                      :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                      color="primary"
                                                      class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                      clearable>

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
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12"  class="pt-5 pb-0">
                                            <v-btn type="submit"
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :block="$vuetify.breakpoint.xsOnly"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   :loading="loading"
                                                   :disabled="loading || invalid ">
                                                {{ $t('sign_in') }}
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
    </v-container>
</template>
<script>

    import {mapGetters} from "vuex"
    import {ValidationObserver, ValidationProvider} from "vee-validate"
    import {mask} from 'vue-the-mask'

    export default {
        name: "Login",
        directives: {
            mask
        },
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                email_show: true,
                email: null,
                phoneRaw: null,
                password: null,
                remember: null,
                passwordHidden: true,
                loading: false,
            };
        },
        mounted() {

            this.getQuery()
        },
        computed: {
            ...mapGetters(['lang']),
            phone: function () {
                return this.changePhone(this.phoneRaw)
            },
            phone_required: function () {
                if (this.email_show === true) {
                    return ''
                }
                return 'required|'
            },
            email_required: function () {
                if (this.email_show === true) {
                    return 'required|'
                }
                return ''
            },
        },
        methods: {
            getQuery(){

                //var encodedString = btoa('demo@infinitylee.com|Demo341!23');
                //console.log("Закодировано: " + encodedString);

                if(this.$route.query && this.$route.query.demo){
                    var decodedString = atob(this.$route.query.demo);
                    var query = decodedString.split("|");
                    this.email = query[0];
                    this.password = query[1];
                }

            },
            changeField(){
               if(this.email_show === true){
                   this.email_show = false;
                   this.email = null;
               }
               else {
                   this.email_show = true;
                   this.phoneRaw = null;
               }
            },
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
            async submit() {
                var _this = this
                this.loading = true;
                await this.$auth
                    .login({
                        body: {
                            phone: this.phone,
                            email: this.email,
                            password: this.password,
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
            }
        }
    }
</script>


