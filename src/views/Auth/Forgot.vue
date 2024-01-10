<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12">
                <transition name="fade">
                    <v-card v-show="show" elevation="0"
                            class="background_color_transparent">
                        <v-form @submit.prevent="submit">
                            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" class="text_hello my-0 py-1">
                                            {{ $t('password_reset') }}
                                        </v-col>
                                        <v-col cols="12" class="pt-5 pb-0" >
                                            <label class="input_label">{{$t('email')}}</label>
                                            <ValidationProvider ref="email" rules="required|email|min:5|max:50"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="email" type="email"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || email=== null)"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 company_input rounded-lg"
                                                >
                                                    <template slot="prepend-inner">
                                                        <v-icon :size="$vuetify.breakpoint.xsOnly ? 24 : 18">${{'emailIcon'}}</v-icon>
                                                    </template>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col cols="12"  class="pt-5 pb-0">
                                            <v-btn type="submit"
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :block="$vuetify.breakpoint.xsOnly"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   :loading="loading"
                                                   :disabled="loading || invalid || !validated">{{ $t('sign_in') }}
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
        name: "Forgot",
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                email: null,
                loading: false,
                show: false
            };
        },
        computed: {
            ...mapGetters(['lang']),
        },
        mounted() {
            this.show = true
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
            async submit() {
                this.loading = true;
                await this.$http
                    .post(`auth/client/forgot`, {
                        email: this.email
                    })
                    .then(res => {
                        this.loading = false;
                        this.$toastr.success(this.$t('confirmation_code_sent_to_you_via_email'));
                        this.$router.push({
                            name: "reset_password",
                            params: { email: this.email }
                        });
                    })
                    .catch(response => {
                        this.loading = false;
                        if (response.body.message) {
                            this.$refs.observer.setErrors([response.body.message]);
                            this.$refs.email.setErrors([
                                this.$t('you_entered_the_wrong_data')
                            ]);
                        }
                        this.$toastr.error(this.$t('you_entered_the_wrong_data'));
                    });
            },
            validateSelect() {
                if (this.email) {
                    this.$refs.observer.validate();
                }
                if (!this.email) {
                    this.$refs.email.errors = [];
                }
            }
        }
    };

</script>

