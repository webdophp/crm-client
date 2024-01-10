<template>

    <v-container fluid justify-center
                 :fill-height = "!$vuetify.breakpoint.xsOnly"
                 class="max_width">
        <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
            <v-col cols="12" v-if="$vuetify.breakpoint.xsOnly" class="d-flex align-end flex-column">
                <v-img src="/img/logo-mini.svg" width="40" ></v-img>
            </v-col>
            <v-col cols="12" class="logo_login" v-if="!$vuetify.breakpoint.xsOnly">
                <v-img src="/img/logo.svg" width="88"></v-img>
            </v-col>
            <v-row justify="center">
                <v-col cols="12" md="2"></v-col>
                <v-col cols="12" md="8">
                    <v-row >
                        <v-col cols="12" sm="4" class="mb-5 pt-6 mx-0 px-0" >
                            <ul>
                                <li @click="setMenu(1)">
                                    <i class="check_ok" v-if="timeline >= 1"></i>
                                    <div class="node" :class="timeline >= 1 ? 'blue_point' : 'grey_point'"></div>
                                    <p>{{$t('management')}}</p>
                                </li>
                                <li class="li_width"><div class="divider" :class="timeline >= 2 ? 'blue_line' : 'grey_line'"></div></li>

                                <li @click="setMenu(2)">
                                    <i class="check_ok" v-if="timeline >= 3"></i>
                                    <div class="node" :class="timeline >= 3 ? 'blue_point' : 'grey_point'"></div>
                                    <p>{{$t('company_data')}}</p>
                                </li>
                                <li class="li_width"><div class="divider" :class="timeline >= 3 ? 'blue_line' : 'grey_line'"></div></li>

                                <li @click="setMenu(3)">
                                    <i class="check_ok" v-if="timeline >= 4"></i>
                                    <div class="node" :class="timeline >= 4 ? 'blue_point' : 'grey_point'"></div>
                                    <p>{{$t('bank_accounts')}}</p>
                                </li>
                                <li class="li_width"><div class="divider" :class="timeline >= 4 ? 'blue_line' : 'grey_line'"></div></li>


                                <li @click="setMenu(4)">
                                    <i class="check_ok" v-if="timeline >= 5"></i>
                                    <div class="node" :class="timeline >= 5 ? 'blue_point' : 'grey_point'"></div>
                                    <p>{{$t('company_logo')}}</p>
                                </li>
                                <li class="li_width"><div class="divider" :class="timeline >= 5 ? 'blue_line' : 'grey_line'"></div></li>

                                <li @click="setMenu(5)">
                                    <i class="check_ok" v-if="timeline >= 6"></i>
                                    <div class="node" :class="timeline >= 6 ? 'blue_point' : 'grey_point'"></div>
                                    <p>{{$t('completion')}}</p>
                                </li>
        <!--                            <li><div class="divider" :class="timeline >= 5 ? 'blue_line' : 'grey_line'"></div></li>-->


                            </ul>
                        </v-col>
                        <v-col cols="12" sm="8" class="px-6 company_data">
                            <div class="company_data_close" >
                                <v-btn icon @click="close">
                                    <v-icon>${{('closeIcon')}}</v-icon>
                                </v-btn>
                            </div>
                            <v-window
                                v-model="step"
                                vertical
                                class="pb-10 "
                            >
                                <v-window-item :value="1" class="my-0 py-0">
                                    <v-row class="my-0 py-0">
                                        <v-col cols="12" class="pt-0 text_hello text-left">
                                            {{$t('tell_us_about_your_director')}}
                                        </v-col>
                                        <v-col cols="12" class="title_login text-left py-0 my-0">
                                           {{$t('tell_us_about_your_director_text')}}
                                        </v-col>
                                    </v-row>
                                    <v-row class="my-0 py-0">
                                        <v-col class="pt-5 pb-0" cols="12" sm="12">
                                            <label class="input_label">{{$t('name_director')}}</label>
                                            <ValidationProvider ref="name_director" rules="required|min:2|max:255"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="name_director" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || name_director=== null)"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <label class="input_label">{{$t('phone_director')}}</label>
                                            <ValidationProvider ref="phone_director" rules="required|phone"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="phoneDirectorRaw" type="tel"
                                                              v-mask="['+# (###) ###-##-##', '+## (###) ###-##-##', '+### (###) ###-##-##']"
                                                              :error-messages="errors"
                                                              :hide-details="(valid || phone_director=== null)"

                                                              :disabled="loading"
                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>

                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0"  cols="12" sm="6">
                                            <label class="input_label">{{$t('email_director')}}</label>
                                            <ValidationProvider ref="email" rules="required|email|min:5|max:50" v-slot="{ errors, valid }">
                                                <v-text-field v-model="email" type="email"
                                                              :error-messages="errors"
                                                              :error="!valid"
                                                              :disabled="loading"
                                                              :hide-details="(valid || email=== null)"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6"></v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <v-btn type="text" :loading="loading"
                                                   dense
                                                   block
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   @click="saveCompany(2)"
                                                   :disabled="invalid || loading"


                                            >
                                                {{ $t('continue') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                                <v-window-item :value="2" class="my-0 py-0">
                                    <v-row class="my-0 py-0">
                                        <v-col cols="12" class="pt-0 text_hello text-left">
                                            {{$t('company_information')}}
                                        </v-col>
                                        <v-col cols="12" class="title_login text-left py-0 my-0">
                                            {{$t('company_information_text')}}
                                        </v-col>
                                    </v-row>
                                    <v-row class="my-0 py-0">
                                        <v-col class="pt-5 pb-0" cols="12" sm="12">
                                            <label class="input_label">{{$t('company_name')}}</label>
                                            <ValidationProvider ref="company" rules="required|min:2|max:255"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="company" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || company=== null)"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="12">
                                            <label class="input_label">{{$t('company_name_legal')}}</label>
                                            <ValidationProvider ref="name_legal" rules="required|min:2|max:255"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="name_legal" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || name_legal=== null) ? true : false"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="12">
                                            <label class="input_label">{{$t('property')}}</label>
                                            <ValidationProvider ref="property" rules="required" v-slot="{ errors, valid }">
                                                <v-select v-model="property" :items="propertyItems"
                                                          item-text="name" item-value="id"
                                                          :error-messages="errors"
                                                          :disabled="loading"
                                                          :hide-details="(valid || property=== null) ? true : false"

                                                          outlined
                                                          solo
                                                          flat
                                                          dense
                                                          :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                          color="primary"
                                                          class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                          clearable
                                                ></v-select>
                                            </ValidationProvider>
                                        </v-col>

                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <label class="input_label">{{$t('phone')}}</label>
                                            <ValidationProvider ref="phone_additional" rules="phone"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="phoneAdditionalRaw" type="tel"
                                                              v-mask="['+# (###) ###-##-##', '+## (###) ###-##-##', '+### (###) ###-##-##']"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || phoneAdditionalRaw=== null) ? true : false"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <label class="input_label">{{$t('bin_iin')}}</label>
                                            <ValidationProvider ref="bin_iin" rules="required|numeric|length:12"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="bin_iin" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || bin_iin=== null) ? true : false"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable autocomplete="off">
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="12">
                                            <label class="input_label">{{$t('address_legal')}}</label>
                                            <ValidationProvider ref="address_legal" rules="required|min:3|max:255"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="address_legal" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || address_legal=== null) ? true : false"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="12">
                                            <label class="input_label">{{$t('address_actually')}}</label>
                                            <ValidationProvider ref="address_actually" rules="min:3|max:255"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="address_actually" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || address_actually=== null)"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>

                                        <v-col class="pt-5 pb-0" cols="12" sm="6"></v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <v-btn type="text" :loading="loading"
                                                   dense
                                                   block
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   @click="saveCompany(3)"
                                                   :disabled="invalid || loading"
                                            >
                                                {{ $t('continue') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                                <v-window-item :value="3" class="my-0 py-0">
                                    <v-row class="my-0 py-0">
                                        <v-col cols="12" class="pt-0 text_hello text-left">
                                            {{$t('bank_accounts')}}
                                        </v-col>
                                        <v-col cols="12" class="title_login text-left py-0 my-0">
                                            {{$t('bank_accounts_text')}}
                                        </v-col>
                                    </v-row>
                                    <v-row class="my-0 py-0" v-for="item in paymentAccountCompaniesItems" :key="item.id">
                                        <v-col cols="12" sm="4" class="font-size-14 font-weight-500">
                                            <label class="input_label">{{$t('bank_name')}}</label>
                                            <div>{{item.name}}</div>
                                        </v-col>
                                        <v-col cols="12" sm="3" class="font-size-14 font-weight-500">
                                            <label class="input_label">{{$t('BIC_bank')}}</label>
                                            <div>{{item.bik}}</div>
                                        </v-col>
                                        <v-col cols="12" sm="5" class="font-size-14 font-weight-500">
                                            <label class="input_label">{{$t('account_number')}}</label>
                                            <div>{{item.currency.letter_code}}: {{item.payment_account}}</div>
                                        </v-col>
                                    </v-row>
                                    <v-row class="my-0 py-0" v-if="addBank">
                                        <v-col cols="12" class="pt-5 pb-0 my-0 text-right">
                                            <v-btn
                                                icon
                                                x-small
                                                @click="addBank = false"
                                            >
                                            <v-icon>
                                                mdi-close
                                            </v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="8">
                                            <label class="input_label">{{$t('bank_name')}}</label>
                                            <ValidationProvider ref="bank_name" rules="required|min:2|max:255"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="bank_name" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || bank_name=== null) ? true : false"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="4">
                                            <label class="input_label">{{$t('BIC_bank')}}</label>
                                            <ValidationProvider ref="bik_bank" rules="required|min:2|max:50"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="bik_bank" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || bik_bank=== null) ? true : false"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="4">
                                            <label class="input_label">{{$t('currency')}}</label>
                                            <ValidationProvider ref="currency" rules="required" v-slot="{ errors, valid }">
                                                <v-select v-model="currency" :items="currencyItems"
                                                          item-text="letter_code" item-value="id"
                                                          :error-messages="errors"
                                                          :disabled="loading"
                                                          :hide-details="(valid || currency=== null) ? true : false"

                                                          outlined
                                                          solo
                                                          flat
                                                          dense
                                                          :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                          color="primary"
                                                          class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                          clearable
                                                ></v-select>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="8">
                                            <label class="input_label">{{$t('account_number')}}</label>
                                            <ValidationProvider ref="payment_account" rules="required|min:2|max:150"
                                                                v-slot="{ errors, valid }">
                                                <v-text-field v-model="payment_account" type="text"
                                                              :error-messages="errors"
                                                              :disabled="loading"
                                                              :hide-details="(valid || payment_account=== null) ? true : false"

                                                              outlined
                                                              solo
                                                              flat
                                                              dense
                                                              :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                              color="primary"
                                                              class="ma-0 pa-0 my-0 py-0 elevation-0 input_text rounded-lg"
                                                              clearable>
                                                </v-text-field>
                                            </ValidationProvider>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="12">
                                            <v-btn type="text" :loading="loading"
                                                   dense
                                                   block
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   @click="savePaymentAccountCompany()"
                                                   :disabled="invalid || loading"
                                            >
                                                {{ $t('add') }}
                                            </v-btn>
                                        </v-col>

                                    </v-row>
                                    <v-row class="my-0 py-0" v-if="!addBank">
                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <v-btn type="text"
                                                   outlined
                                                   block
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   @click="addBank = true"
                                            >
                                                {{ $t('add_more') }}
                                            </v-btn>

                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <v-btn type="text" :loading="loading"
                                                   dense
                                                   block
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   @click="setMenu(4)"
                                                   :disabled="invalid || loading"
                                            >
                                                {{ $t('continue') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                                <v-window-item :value="4" class="my-0 py-0">
                                    <v-row class="my-0 py-0">
                                        <v-col cols="12" class="pt-0 text_hello text-left">
                                            {{$t('company_logo')}}
                                        </v-col>
                                        <v-col cols="12" class="title_login text-left py-0 my-0">
                                            {{$t('company_logo_text')}}
                                        </v-col>
                                    </v-row>
                                    <v-row class="my-0 py-0">
                                        <v-col v-if="step===4" cols="12" sm="12" md="12" class="pt-5 pb-0 text-center">
                                            <make-logo v-if="step===4" v-model="logo" aspect-ratio="1"/>
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6"></v-col>
                                        <v-col class="pt-5 pb-0" cols="12" sm="6">
                                            <v-btn type="text" :loading="loading"
                                                   dense
                                                   block
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   @click="saveCompany(5)"
                                                   :disabled="invalid || loading"
                                            >
                                                {{ $t('continue') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                                <v-window-item :value="5" class="my-0 py-0">
                                    <v-row class="my-0 py-0">
                                        <v-col cols="12" class="pt-0 text_hello text-left">
                                            {{$t('we_are_preparing_your_docs')}}
                                        </v-col>
                                        <v-col cols="12" class="title_login text-left py-0 my-0">
                                            {{$t('we_are_preparing_your_docs_text')}}
                                        </v-col>
                                        <v-col class="pt-5 pb-0" cols="12" >
                                            <v-btn type="text" :loading="loading"
                                                   dense
                                                   block
                                                   color="primary"
                                                   class="rounded-lg but_enter"
                                                   :height="$vuetify.breakpoint.xsOnly ? 45 : 35"
                                                   @click="done()"
                                            >
                                                {{ $t('done') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-window-item>
                            </v-window>

                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="12" md="2"></v-col>
            </v-row>


        </ValidationObserver>

        <v-overlay :value="loading" z-index="10" color="#244ba8">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>
<script>

    import {ValidationObserver, ValidationProvider} from 'vee-validate'
    import {mask} from 'vue-the-mask'
    import {mapGetters} from "vuex"
    import MakeLogo from '../components/MakeLogo.vue'


    export default {
        name: 'CompanyEdit',
        directives: {
            mask,
        },
        components: {
            ValidationProvider,
            ValidationObserver,
            MakeLogo
        },

        data() {
            return {
                length: 3,
                step: 1,
                timeline: 0,
                addBank: false,
                bank_name: null,
                bik_bank: null,
                payment_account: null,



                progress: 0,
                tab: 0,
                phoneDirectorRaw: null,
                phoneAdditionalRaw: null,
                company_uuid: null,
                company: null,
                phone_director: null,
                name_legal: null,
                name_director: null,
                address_actually: null,
                address_legal: null,
                contract_number: null,
                checking_account: null,
                email: null,
                bin_iin: null,
                logo: null,
                notes: null,
                description: null,
                active: false,
                deleted: false,
                loading: true,
                loadingClients: false,
                date_contract: null,
                dateDialogContract: false,
                clients: [],
                clientItems: [],
                exist_translations: {},
                all_translations: true,

                meta_title: null,
                meta_keywords: null,
                meta_description: null,
                property: null,
                propertyItems: [],
                currency: null,
                currencyItems: [],
                paymentAccountCompaniesItems: [],
            }
        },
        computed: {
            ...mapGetters(['listLanguages', 'lang', 'phoneMask']),
            phone: function () {
                return this.changePhone(this.phoneDirectorRaw)
            },
            phoneAdditional: function () {
                return this.changePhone(this.phoneAdditionalRaw)
            },
            languages() {
                return this.listLanguages
            },
        },
        async mounted() {
            this.language = this.languages[this.tab]
            await this.getFormProperties();
            await this.getCurrencies();
            await this.getCompany()
            await this.getPaymentAccountCompanies();
        },
        methods: {
            async setLanguage(val) {
                this.language = this.languages[val]
               // await this.getCompany()
            },
            setMenu(index){
               this.timeline = index;
               this.step = index;
            },
            close(){
                this.$router.push({
                    name: 'topic'
                })
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
            async getCurrencies() {
                let params = {};
                params.filter = 'all';
                await this.$http
                    .get(`client/currency`, {
                        params: params,
                    })
                    .then(res => {
                        this.currencyItems = res.body.data
                    })
                    .catch(err => {
                        this.currencyItems = [];
                        this.$toastr.error(this.$t('failed_to_get_list_currencies'))
                    });
            },
            async getPaymentAccountCompanies() {
                let params = {};
                params.filter = 'all';
                params.company_uuid = this.company_uuid;
                await this.$http
                    .get(`client/payment_account_company`, {
                        params: params,
                    })
                    .then(res => {
                        this.paymentAccountCompaniesItems = res.body.data
                        if(this.paymentAccountCompaniesItems.length === 0){
                            this.addBank = true
                        }
                    })
                    .catch(err => {
                        this.paymentAccountCompaniesItems = [];
                        this.$toastr.error(this.$t('failed_to_get_list_payment_account_companies'))
                    });
            },
            async savePaymentAccountCompany(){
                var _this = this;
                this.progress = 0
                this.loading = true
                var formData = new FormData()

                if (this.company_uuid) {
                    formData.append('company_uuid', this.company_uuid)
                }
                if (this.currency) {
                    formData.append('currency', this.currency)
                }

                if (this.payment_account) {
                    formData.append('payment_account', this.payment_account)
                }
                if (this.bik_bank) {
                    formData.append('bik_bank', this.bik_bank)
                }
                if (this.bank_name) {
                    formData.append('bank_name', this.bank_name)
                }

                // Save
                await this.$http
                    .post(`client/payment_account_company`, formData, {
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
                        this.$toastr.success(this.$t('payment_account_company_has_been_updated'));
                        if (res && res.body && res.body.status && res.body.status === 'success' ) {
                            this.getPaymentAccountCompanies();
                            this.bank_name = null;
                            this.bik_bank = null;
                            this.payment_account = null;
                            this.currency = null;
                            this.addBank = false
                        }
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('payment_account_company_has_not_been_updated'));
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
            async getCompany() {
                var _this = this;
                this.progress = 0
                this.loading = true
                let params = {};
                if (this.languages && this.languages[this.tab]) {
                    params.language = this.languages[this.tab]
                }
                await this.$http
                    .get(`client/company/${this.$route.params.uuid}`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.company_uuid = res.body.data.uuid
                        this.company = res.body.data.name
                        this.name_legal = res.body.data.name_legal
                        this.property = res.body.data.form_property_id
                        this.name_director = res.body.data.name_director
                        this.address_actually = res.body.data.address_actually
                        this.address_legal = res.body.data.address_legal
                        this.contract_number = res.body.data.contract_number
                        this.checking_account = res.body.data.checking_account
                        this.phoneDirectorRaw = res.body.data.phone
                        this.phoneAdditionalRaw = res.body.data.phone_additional
                        this.bin_iin = res.body.data.bin_iin
                        this.email = res.body.data.email
                        this.date_contract = res.body.data.date_contract
                        this.active = res.body.data.active
                        this.deleted = res.body.data.deleted
                        this.notes = res.body.data.notes
                        this.description = res.body.data.description
                        this.logo = res.body.data.logo
                        this.meta_title = res.body.data.meta_title
                        this.meta_keywords = res.body.data.meta_keywords
                        this.meta_description = res.body.data.meta_description
                        this.clients = res.body.data.clients
                        this.exist_translations = res.body.data.exist_translations
                        this.all_translations = res.body.data.all_translations

                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_company'));
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async saveCompany(index) {
                var _this = this;
                this.progress = 0
                this.loading = true
                var formData = new FormData()
                if (this.languages && this.languages[this.tab]) {
                    formData.append('language', this.languages[this.tab])
                }
                if (this.property) {
                    formData.append('property', this.property)
                }
                if (this.company) {
                    formData.append('company', this.company)
                }
                if (this.name_legal) {
                    formData.append('name_legal', this.name_legal)
                }
                if (this.name_director) {
                    formData.append('name_director', this.name_director)
                }
                if (this.phone) {
                    formData.append('phone', this.phone)
                }
                if (this.phoneAdditional) {
                    formData.append('phone_additional', this.phoneAdditional)
                }
                if (this.email) {
                    formData.append('email', this.email)
                }
                if (this.bin_iin) {
                    formData.append('bin_iin', this.bin_iin)
                }
                if (this.address_actually) {
                    formData.append('address_actually', this.address_actually)
                }
                if (this.address_legal) {
                    formData.append('address_legal', this.address_legal)
                }
                if (this.contract_number) {
                    formData.append('contract_number', this.contract_number)
                }
                if (this.checking_account) {
                    formData.append('checking_account', this.checking_account)
                }
                if (this.date_contract) {
                    formData.append('date_contract', this.date_contract)
                }
                if (this.notes) {
                    formData.append('notes', this.notes)
                }
                if (this.description) {
                    formData.append('description', this.description)
                }
                if (this.active) {
                    formData.append('active', 1)
                }
                if (this.deleted) {
                    formData.append('deleted', 1)
                }

                if (this.meta_keywords && this.meta_keywords !== '') {
                    formData.append('meta_keywords', this.meta_keywords)
                }

                if (this.clients && this.clients.length > 0) {
                    for (let i in this.clients) {
                        if (this.clients[i].id !== undefined && this.clients[i].id > 0) {
                            formData.append(`clients[${i}]`, this.clients[i].id)
                        }
                    }
                }

                if (this.logo) {
                    if (this.logo.length > 250) {
                        var mimeTypeLogo = this.getMimeType(this.logo)
                        var blobLogo = this.dataURL64toBlob(this.logo)
                        if (mimeTypeLogo && blobLogo) {
                            formData.append('logo', blobLogo, mimeTypeLogo)
                        }
                    } else {
                        formData.append('logo', this.logo)
                    }
                }


                // Save
                await this.$http
                    .put(`client/company/${this.company_uuid}`, formData, {
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
                        this.$toastr.success(this.$t('company_has_been_updated'));
                        if (res && res.body && res.body.data && res.body.data.exist_translations) {

                            this.timeline = index;
                            this.step = index;
                            this.exist_translations = res.body.data.exist_translations
                            this.all_translations = res.body.data.all_translations
                        }
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('company_has_not_been_updated'));
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
            async done(){

                let params = {};
                params.topic_uuid = this.$route.params.uuid;
                await this.$http
                    .get('client/company/edit/completed', {
                        params: params,
                    })
                    .then(res => {
                        this.$router.push({
                            name: 'topic'
                        })
                    })
                    .catch(err => {
                        this.propertyItems = [];
                        this.$toastr.error(this.$t('failed_to_get_list_properties'))
                    });

            }
        }
    }
</script>

<style scoped>
.node {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display:inline-block;
    transition: all 1000ms ease;
}
.divider {
    height: 65px;
    width: 2px;
    margin-left: 4px;
    transition: all 800ms ease;
}
li p {
    display:inline-block;
    margin: 0 0 0 12px !important;
    position: absolute;
    left: 12px;
}
li {
    list-style: none;
    line-height: 1px;
    position: relative;
}
li:after, li:before, li p:after, li p:before { margin:0; padding:0; }
.blue_line{ background-color: #007EC9; }
.blue_point{ background: url("../../public/img/point_ok.png");}
.grey_line { background-color:  #B3B3B3; }
.grey_point { background: url("../../public/img/point_default.png"); }
.check_ok{
    height: 11px;
    width: 14px;
    background: url("../../public/img/check_ok.png");
    display: block;
    position: absolute;
    left: -25px;

}
.blue_point1 ~ p{
    color: #007EC9;

    font-size: 12px;
    font-weight: 700;
    line-height: 11px;
    letter-spacing: 0;
    text-align: left;

}
.grey_point1 ~ p{
    font-size: 12px;
    font-weight: 700;
    line-height: 11px;
    letter-spacing: 0;
    text-align: left;
    color: #B3B3B3;

}
.company_data{
    position: relative;
}
.company_data_close{
    position: absolute;
    right: -10px;
    top: -40px
}

@media (max-width: 599px) {
    .node {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        display:inline-block;
        transition: all 1000ms ease;
    }
    .divider {
        height: 2px;
        width: 100%;
        margin: 3px 0 0 0;
        transition: all 800ms ease;
    }
    li {
        list-style: none;
        line-height: 1px;
        position: relative;
        float: left;
    }
    li p {
        display:inline-block;
        margin-left: 25px;
        position: absolute;
        top: 16px;
        width: 230px;
        left: -22px;
        font-size: 11px;
        font-weight: 700;
        line-height: 14px;
        letter-spacing: 0;
        color: #B3B3B3;
    }
    li p.blue{
        color: #007EC9;
    }
    .li_width{
        width: 20%;
    }
    li p{
        display: none;
    }
    .blue_point{ background-size: 8px 8px;}
    .grey_point {  background-size: 8px 8px;}
    .check_ok{
        left: -2px;
        top: -16px;
    }
    .company_data{
        position: unset;
    }
    .company_data_close{

        right: auto;
        top: 15px;
        left: 10px;
    }
}

</style>
