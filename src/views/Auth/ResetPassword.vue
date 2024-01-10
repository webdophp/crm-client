<template>
    <v-container >
        <v-row>
            <v-col cols="12">
                <transition name="fade">
                    <v-card elevation="0"
                            class="background_color_transparent">

                        <v-form @submit.prevent="submit">
                            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" class="text_hello my-0 py-1">
                                            {{ $t('password_reset') }}
                                        </v-col>
                                        <v-col cols="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('email')}}</label>

                                            <ValidationProvider ref="email" rules="required|email|min:5|max:50"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="email" type="email"
                                                              :hide-details="(valid || email=== null)"
                                                              disabled
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
                                        <v-col cols="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('code_from_email')}}</label>
                                            <ValidationProvider ref="code" rules="required|min:4|max:4"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="code"
                                                              :hide-details="(valid || code=== null)"
                                                              :type="codeHidden ? 'password' : 'text'"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>

                                                    <template slot="prepend-inner">
                                                        <v-icon :size="$vuetify.breakpoint.xsOnly ? 24 : 18">${{'emailIcon'}}</v-icon>
                                                    </template>
                                                    <template slot="append">
                                                        <v-btn icon @click="() => (codeHidden = !codeHidden)">
                                                            <v-icon :size="$vuetify.breakpoint.xsOnly ? 28 : 22">${{codeHidden ? 'eyeOffIcon' : 'eyeIcon'}}</v-icon>
                                                        </v-btn>
                                                    </template>

                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('new_password')}}</label>
                                            <ValidationProvider ref="password" rules="required|min:8|max:30"
                                                                vid="confirmation" skipOptional="true"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="password"
                                                              :hide-details="(valid || password=== null)"
                                                              :type="passwordHidden ? 'password' : 'text'"
                                                              :error-messages="errors" :disabled="loading"
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
                                        <v-col cols="12" class="pt-5 pb-0">
                                            <label class="input_label">{{$t('repeat_password')}}</label>
                                            <ValidationProvider ref="password" rules="required|min:8|max:30|confirmed:confirmation"
                                                                skipOptional="true" v-slot="{ errors, valid }">
                                                <v-text-field v-model="password_confirmation"
                                                             :type="passwordConfirmHidden ? 'password' : 'text'"
                                                              :error-messages="errors"  :disabled="loading"
                                                              :hide-details="(valid || password_confirmation=== null)"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                               clearable>
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
                                            <v-btn type="submit"
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   style="width: auto !important;"
                                                   :block="$vuetify.breakpoint.xsOnly"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   :loading="loading"
                                                   :disabled="loading || invalid || !validated">{{ $t('reset_password') }}
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

    export default {
        name: "ResetPassword",
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                email: null,
                code: null,
                codeHidden: true,
                password: null,
                passwordHidden: true,
                password_confirmation: null,
                passwordConfirmHidden: true,
                loading: false,
            };
        },
        computed: {
            ...mapGetters(['lang']),
        },
        mounted() {
            this.email = this.$route.params.email
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
            async clear() {
                this.email = this.code = null;
                requestAnimationFrame(() => {
                    this.$refs.observ.reset();
                });
            },
            async submit() {
                this.loading = true;

                await this.$http
                    .post("auth/client/reset/password", {
                        email: this.email,
                        password: this.password,
                        code: this.code
                    })
                    .then(res => {
                        this.$toastr.success(this.$t('code_has_been_successfully_confirmed_and_password_has_been_set'));
                        this.login(this.email,this.password)
                        this.loading = false;
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$toastr.error(this.$t('you_entered_the_wrong_data'));
                        if (err && err.body && err.body.message) {
                            for (let prop in err.body.errors) {
                                console.log(prop);
                                if (hasOwnProperty.call(err.body.errors, prop)) {
                                    if (this.$refs[prop]) {
                                        this.$refs[prop].setErrors([
                                            err.body.errors[prop][0]
                                        ])
                                    }
                                }
                            }
                            if (!err.body.errors) {
                                this.$toastr.error(err.body.message)
                            }
                        }
                    });
            },
            validateSelect() {
                if (this.email || this.code) {
                    this.$refs.observer.validate();
                }
                if (!this.email) {
                    this.$refs.email.errors = [];
                }
                if (!this.code) {
                    this.$refs.code.errors = [];
                }
            },

            async login(email,password){
                await this.$auth
                    .login({
                        body: {
                            email: email,
                            password: password,
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
                                        if (this.$refs[prop]) {
                                            this.$refs[prop].setErrors([
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
            }
        }
    };

</script>

