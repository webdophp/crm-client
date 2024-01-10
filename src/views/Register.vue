<template>
    <v-container fluid>
        <v-form @submit.prevent="saveAbout">
            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                <v-card flat>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-subheader class="headline">{{ $t('about_company_data') }}</v-subheader>
                            </v-col>
                            <v-col class="py-0" cols="12" md="6">
                                <v-tabs v-model="tab" background-color="transparent"
                                        :right="$vuetify.breakpoint.mdAndUp"
                                        :grow="$vuetify.breakpoint.smAndDown"
                                        color="deep-purple accent-4" @change="setLanguage" class="pb-4">
                                    <v-tab ref="language" v-for="language in languages" :key="language">
                                        <span :class="exist_translations[language] ? '' : 'red--text '">
                                            {{ language }}
                                        </span>
                                    </v-tab>
                                </v-tabs>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="3" md="2">
                                <v-row>
                                    <v-col cols="12" class="py-0 text-center">
                                        <ValidationProvider ref="logo" rules="required"
                                                            v-slot="{ errors, valid }">
                                            <make-logo v-model="logo" aspect-ratio="1"/>
                                            <div v-if="!valid" class="mt-2 red--text text-center">
                                                {{ errors[0] ? errors[0] : $t('logo_not_added') }}
                                            </div>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="9" md="10">
                                <v-row>
                                    <v-col class="py-0" cols="12" sm="6">
                                        <ValidationProvider ref="name" rules="required|min:3|max:255"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="name" type="text" :error-messages="errors"
                                                          :error="!valid" :disabled="loading"
                                                          :label="$t('about_company_name')"
                                                          prepend-icon="mdi-home"
                                                          color="primary" clearable>
                                            </v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col class="py-0" cols="12" sm="6">
                                        <ValidationProvider ref="email" rules="required|email|min:5|max:50"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="email" type="email" :error-messages="errors"
                                                          :error="!valid" :disabled="loading" label="Email"
                                                          prepend-icon="mdi-email"
                                                          color="primary" clearable>
                                            </v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col class="py-0" cols="12">
                                        <ValidationProvider ref="address" rules="required|min:3|max:255"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="address" type="test" :error-messages="errors"
                                                          :error="!valid" :disabled="loading" :label="$t('address')"
                                                          prepend-icon="mdi-map-marker-radius"
                                                          color="primary" clearable>
                                            </v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col class="py-0" cols="12" sm="6">
                                        <ValidationProvider ref="phone1" rules="required|phone"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="phoneRaw" type="tel"
                                                          v-mask="['+# (###) ###-##-##', '+## (###) ###-##-##', '+### (###) ###-##-##']"
                                                          :error="!valid" :error-messages="errors" :disabled="loading"
                                                          prepend-icon="mdi-phone"
                                                          :label="$t('phone')" color="primary"
                                                          clearable>
                                            </v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col class="py-0" cols="12" sm="6">
                                        <ValidationProvider ref="phone2" rules="phone"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="phoneAdditionalRaw" type="tel"
                                                          v-mask="['+# (###) ###-##-##', '+## (###) ###-##-##', '+### (###) ###-##-##']"
                                                          :error-messages="errors" :disabled="loading"
                                                          prepend-icon="mdi-phone"
                                                          :label="$t('additional_phone')" color="primary"
                                                          clearable>
                                            </v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="whatsapp" name="whatsapp" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="whatsapp" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-whatsapp"
                                                  :label="$t('whatsapp_link')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="facebook" name="facebook" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="facebook" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-facebook"
                                                  :label="$t('facebook_link')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="telegram" name="telegram" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="telegram" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-send mdi-rotate-315"
                                                  :label="$t('telegram_link')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="instagram" name="instagram" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="instagram" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-instagram"
                                                  :label="$t('instagram_link')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="skype" name="skype" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="skype" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-skype"
                                                  :label="$t('skype_link')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="vk" name="vk" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="vk" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading"
                                                  :label="$t('vk_link')" color="primary"
                                                  clearable>
                                        <template v-slot:prepend>
                                            <svg xmlns="http://www.w3.org/2000/svg" :fill="$vuetify.theme.dark ? '#FFFFFF' : 'rgba(0,0,0,0.47)'" viewBox="0 0 24 24" width="24px" height="24px"><path d="M 21.800781 0 L 2.199219 0 C 0.984375 0 0 0.984375 0 2.199219 L 0 21.800781 C 0 23.015625 0.984375 24 2.199219 24 L 21.800781 24 C 23.015625 24 24 23.015625 24 21.800781 L 24 2.199219 C 24 0.984375 23.015625 0 21.800781 0 Z M 19.050781 14.089844 C 20.492188 15.429688 20.789063 16.078125 20.839844 16.160156 C 21.4375 17.148438 20.179688 17.226563 20.179688 17.226563 L 17.773438 17.261719 C 17.773438 17.261719 17.257813 17.363281 16.578125 16.894531 C 15.679688 16.277344 14.828125 14.671875 14.171875 14.882813 C 13.5 15.09375 13.519531 16.539063 13.519531 16.539063 C 13.519531 16.539063 13.527344 16.792969 13.375 16.960938 C 13.207031 17.136719 12.882813 17.117188 12.882813 17.117188 L 11.808594 17.117188 C 11.808594 17.117188 9.433594 17.316406 7.34375 15.140625 C 5.0625 12.765625 3.050781 8.078125 3.050781 8.078125 C 3.050781 8.078125 2.933594 7.785156 3.058594 7.636719 C 3.199219 7.46875 3.585938 7.464844 3.585938 7.464844 L 6.15625 7.449219 C 6.15625 7.449219 6.398438 7.492188 6.574219 7.617188 C 6.71875 7.722656 6.796875 7.921875 6.796875 7.921875 C 6.796875 7.921875 7.214844 8.972656 7.761719 9.925781 C 8.839844 11.78125 9.339844 12.1875 9.703125 11.988281 C 10.234375 11.695313 10.074219 9.363281 10.074219 9.363281 C 10.074219 9.363281 10.085938 8.515625 9.808594 8.136719 C 9.59375 7.847656 9.1875 7.761719 9.007813 7.738281 C 8.863281 7.71875 9.101563 7.382813 9.410156 7.230469 C 9.871094 7.007813 10.6875 6.992188 11.65625 7.003906 C 12.40625 7.011719 12.625 7.058594 12.917969 7.128906 C 13.804688 7.34375 13.503906 8.171875 13.503906 10.152344 C 13.503906 10.789063 13.390625 11.679688 13.847656 11.976563 C 14.046875 12.105469 14.527344 11.996094 15.730469 9.949219 C 16.304688 8.980469 16.730469 7.839844 16.730469 7.839844 C 16.730469 7.839844 16.824219 7.636719 16.972656 7.550781 C 17.121094 7.460938 17.320313 7.488281 17.320313 7.488281 L 20.027344 7.472656 C 20.027344 7.472656 20.839844 7.375 20.972656 7.742188 C 21.109375 8.128906 20.667969 9.027344 19.5625 10.5 C 17.746094 12.917969 17.546875 12.691406 19.050781 14.089844 Z"/></svg>
                                        </template>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="youtube" name="youtube" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="youtube" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-youtube"
                                                  :label="$t('youtube_link')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="site" name="site" rules="link"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="site" type="text"
                                                  :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-web"
                                                  :label="$t('site_link')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col cols="12">
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header class="primary white--text">
                                            {{ $t('map') }}
                                            <template v-slot:actions>
                                                <v-icon color="white">$expand</v-icon>
                                            </template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content class="map">
                                            <yandex-map v-if="coords && showMap" ref="map"
                                                        :coords="coords"
                                                        :show-all-markers="showAllMarkers"
                                                        :zoom="zoom"
                                                        @map-was-initialized="initHandler"
                                                        @click="onClickMap">
                                                <ymap-marker ref="mapMarker"
                                                             marker-id="123"
                                                             marker-type="placemark"
                                                             :coords="coords"
                                                             :hint-content="hintMapContent"
                                                             @dragend="onDragendMap"/>
                                            </yandex-map>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                                <div v-if="(coords[0] === 0 && coords[1] === 0)" class="mt-2 red--text">
                                    {{ $t('location_coordinates_not_set') }}
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <h3 class="mb-2 font-weight-medium">{{ $t('description') }}</h3>
                                <ValidationProvider ref="description"
                                                    rules="required|min:3|max:65535"
                                                    v-slot="{ errors, valid }">
                                    <tinymce-editor id="description" v-model="description"
                                                    :init="tinymceInit"></tinymce-editor>
                                    <div v-show="!valid" class="mt-2 red--text">
                                        {{ errors[0] ? errors[0] : $t('description_not_added') }}
                                    </div>
                                </ValidationProvider>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="pt-0" cols="12">
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header class="primary white--text">
                                            {{ $t('seo') }}
                                            <template v-slot:actions>
                                                <v-icon color="white">$expand</v-icon>
                                            </template>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content>
                                            <v-card flat>
                                                <v-row>
                                                    <v-col class="py-0" cols="12">
                                                        <ValidationProvider ref="meta_title" rules="min:1|max:255"
                                                                            v-slot="{ errors, valid }">
                                                            <v-text-field v-model="meta_title" type="text"
                                                                          :error-messages="errors" :disabled="loading"
                                                                          :label="$t('page_seo_title')" color="primary" clearable>
                                                            </v-text-field>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col class="py-0" cols="12">
                                                        <ValidationProvider ref="meta_keywords" rules="min:1|max:255"
                                                                            v-slot="{ errors, valid }">
                                                            <v-textarea v-model="meta_keywords"
                                                                        :error-messages="errors" :disabled="loading"
                                                                        :label="$t('page_seo_keywords')"
                                                                        rows="5" row-height="15" auto-grow outlined>
                                                            </v-textarea>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col class="py-0" cols="12">
                                                        <ValidationProvider ref="meta_description" rules="min:1|max:255"
                                                                            v-slot="{ errors, valid }">
                                                            <v-textarea v-model="meta_description"
                                                                        :error-messages="errors" :disabled="loading"
                                                                        :label="$t('page_seo_description')"
                                                                        rows="10" row-height="15" auto-grow outlined>
                                                            </v-textarea>
                                                        </ValidationProvider>
                                                    </v-col>
                                                    <v-col class="pt-0" cols="12">
                                                        <v-card flat outlined elevation="3">
                                                            <v-card-title class="subtitle-1 font-weight-medium py-1 primary white--text">
                                                                {{ $t('seo_search_engine_page_preview') }}
                                                            </v-card-title>
                                                            <v-divider></v-divider>
                                                            <v-card-text class="pa-0">
                                                                <v-card flat elevation="0">
                                                                    <v-card-title class="subtitle-1 blue--text" v-text="get_meta_title"></v-card-title>
                                                                    <v-card-text class="body-1" v-text="get_meta_description + '...'"></v-card-text>
                                                                </v-card>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                                <div v-if="!meta_title || !meta_keywords || !meta_description " class="mt-2 red--text">
                                    {{ $t('seo_description_empty') }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="px-4 py-4">
                        <v-progress-linear v-if="!$vuetify.breakpoint.xsOnly" v-model="progress"
                                           :active="loading" class="mx-2"></v-progress-linear>
                        <v-spacer v-if="!$vuetify.breakpoint.xsOnly"></v-spacer>
                        <v-btn type="submit" :disabled="invalid || loading" :loading="loading"
                               :block="$vuetify.breakpoint.xsOnly" color="primary">
                            {{ $t('save') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </ValidationObserver>
        </v-form>
    </v-container>
</template>
<script>

import {ValidationObserver, ValidationProvider} from 'vee-validate'
import {mask} from 'vue-the-mask'
import {mapGetters} from "vuex"
import MakeLogo from '../components/MakeLogo.vue'
import TinymceEditor from '@tinymce/tinymce-vue'
import {loadYmap, yandexMap, ymapMarker} from 'vue-yandex-maps'

export default {
    name: 'About',
    directives: {
        mask,
    },
    components: {
        ValidationProvider,
        ValidationObserver,
        MakeLogo,
        TinymceEditor,
        yandexMap,
        ymapMarker
    },
    inject: ['forceRerender'],
    data() {
        return {
            loading: false,
            progress: 0,
            tab: 0,
            language: null,
            phoneRaw: null,
            phoneAdditionalRaw: null,
            logo: null,
            name: null,
            email: null,
            description: null,
            address: null,
            whatsapp: null,
            facebook: null,
            instagram: null,
            telegram: null,
            skype: null,
            vk: null,
            youtube: null,
            site: null,
            exist_translations: {},
            all_translations: true,
            showAllMarkers: false,
            mapMarker: null,
            hintMapContent: null,
            zoom: 17,
            ymaps: null,
            coordinates: [],
            showMap: false,
            meta_title: null,
            meta_keywords: null,
            meta_description: null,
        }
    },
    computed: {
        ...mapGetters(['listLanguages', 'lang', 'phoneMask']),
        phone: function () {
            return this.changePhone(this.phoneRaw)
        },
        phoneAdditional: function () {
            return this.changePhone(this.phoneAdditionalRaw)
        },
        tinymceInit() {
            return this.tinymceInitDefault()
        },
        languages() {
            return this.listLanguages
        },
        coords: {
            get: function () {
                return (this.coordinates && this.coordinates.length === 2) ? this.coordinates : [0, 0]
            },
            set: function (val) {
                this.coordinates = (val && val.length === 2) ? val : [0, 0]
            }
        },
        mapSettings() {
            if (this.language === 'en') {
                this.$yandex.lang = 'en_US'
            } else if (this.language === 'kk') {
                this.$yandex.lang = 'ru_RU'
            } else {
                this.$yandex.lang = 'ru_RU'
            }
            return this.$yandex
        },
        get_meta_title() {
            return this.meta_title ? this.meta_title : (this.name ? this.name.substr(0, 255) : '')
        },
        get_meta_description() {
            return this.meta_description ? this.meta_description : (this.description ? this.description.stripTags().substr(0, 255) : '')
        }
    },
    async mounted() {
        this.loading = true
        this.language = this.languages[this.tab]
        await this.ymapInit()
        await this.getAbout()
    },
    methods: {
        async ymapInit() {
            var _this = this
            if (window.ymaps) {
                this.showMap = false
                if (this.$refs.map && this.$refs.map.myMap) {
                    this.$refs.map.myMap.destroy()
                }
                document.getElementById("vue-yandex-maps").remove()
                delete window.ymaps
            }
            await loadYmap({...this.mapSettings, debug: false})
            if (window.ymaps) {
                window.ymaps.ready(function () {
                    _this.showMap = true
                })
            }
        },
        initHandler(e) {
            if (this.coords && this.coords.length !== 2 && window.ymaps) {
                var location = window.ymaps.geolocation.get({
                    provider: 'yandex',
                    mapStateAutoApply: true,
                    autoReverseGeocode: true
                })
                location.then(
                    function (result) {
                        //console.log(result.geoObjects.get(0).geometry.getCoordinates())
                        e.geoObjects.add(result.geoObjects)
                    },
                    function (err) {
                        console.log('Error: ' + err)
                    }
                )
            }
            e.geoObjects.options.set('draggable', true)
        },
        onClickMap(e) {
            var _this = this
            this.coords = e.get('coords')
            var myGeocoder = window.ymaps.geocode(this.coords)
            myGeocoder.then(
                function (res) {
                    let GeocoderMetaData = res.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData
                    if (GeocoderMetaData.Address.Components) {
                        let Components = GeocoderMetaData.Address.Components
                        let address_full = []
                        let street_full = []
                        let district = Components.filter(item => item.kind === 'district')
                        if (district.length > 0) {
                            address_full.push(district[0].name)
                            street_full.push(district[0].name)
                        }
                        let street = Components.filter(item => item.kind === 'street')
                        if (street.length > 0) {
                            address_full.push(street[0].name)
                            street_full.push(street[0].name)
                        }
                        let house = Components.filter(item => item.kind === 'house')
                        if (house.length > 0) {
                            address_full.push(house[0].name)
                            _this.house = house[0].name
                        }
                        _this.street = street_full.join(', ')
                        _this.address = address_full.join(', ')
                    }

                },
                function (err) {
                    console.log('Error Load GeocoderMetaData')
                }
            )
            //this.zoom = 16
        },
        onDragendMap(e) {
            var _this = this
            this.coords = e.get('target').geometry.getCoordinates()
            var myGeocoder = window.ymaps.geocode(this.coords)
            myGeocoder.then(
                function (res) {
                    let GeocoderMetaData = res.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData
                    if (GeocoderMetaData.Address.Components) {
                        let Components = GeocoderMetaData.Address.Components
                        let address_full = []
                        let street_full = []
                        let district = Components.filter(item => item.kind === 'district')
                        if (district.length > 0) {
                            address_full.push(district[0].name)
                            street_full.push(district[0].name)
                        }
                        let street = Components.filter(item => item.kind === 'street')
                        if (street.length > 0) {
                            address_full.push(street[0].name)
                            street_full.push(street[0].name)
                        }
                        let house = Components.filter(item => item.kind === 'house')
                        if (house.length > 0) {
                            address_full.push(house[0].name)
                            _this.house = house[0].name
                        }
                        _this.street = street_full.join(', ')
                        _this.address = address_full.join(', ')
                    }

                },
                function (err) {
                    console.log('Error Load GeocoderMetaData')
                }
            )
        },
        async setLanguage(val) {
            this.language = this.languages[val]
            await this.ymapInit()
            await this.getAbout()
        },
        async getAbout() {
            this.loading = true
            var _this = this
            let params = {};
            if (this.language) {
                params.language = this.language;
            }
            await this.$http
                .get(`admin/about`, {params: params})
                .then(res => {
                    this.name = res.body.data.name
                    this.hintMapContent = res.body.data.name
                    this.logo = res.body.data.logo
                    this.phoneRaw = res.body.data.phone
                    this.phoneAdditionalRaw = res.body.data.phone_additional
                    this.email = res.body.data.email
                    this.address = res.body.data.address
                    this.whatsapp = res.body.data.whatsapp
                    this.facebook = res.body.data.facebook
                    this.skype = res.body.data.skype
                    this.telegram = res.body.data.telegram
                    this.vk = res.body.data.vk
                    this.youtube = res.body.data.youtube
                    this.site = res.body.data.site
                    this.instagram = res.body.data.instagram
                    this.description = res.body.data.description
                    this.meta_title = res.body.data.meta_title
                    this.meta_keywords = res.body.data.meta_keywords
                    this.meta_description = res.body.data.meta_description
                    this.exist_translations = res.body.data.exist_translations
                    this.all_translations = res.body.data.all_translations

                    var coordinates = res.body.data.location

                    if (typeof coordinates === 'object' && coordinates.length === 2) {
                        this.coords = coordinates
                    } else {
                        if (window.ymaps) {
                            var location = window.ymaps.geolocation.get()
                            location.then(
                                function (result) {
                                    _this.coords = result.geoObjects.get(0).geometry.getCoordinates()
                                },
                                function (err) {
                                    console.log('Erros: ' + err)
                                }
                            )
                        }
                    }
                    this.zoom = 17
                })
                .catch(err => {
                    this.$toastr.error(this.$t('failed_to_get_about'));
                })
                .finally(end => {
                    this.loading = false
                })
        },
        async saveAbout() {
            var _this = this;
            this.progress = 0
            this.loading = true
            var formData = new FormData()
            if (this.languages && this.languages[this.tab]) {
                formData.append('language', this.languages[this.tab])
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
            if (this.phoneAdditional) {
                formData.append('phone_additional', this.phoneAdditional)
            }
            if (this.whatsapp) {
                formData.append('whatsapp', this.whatsapp)
            }
            if (this.facebook) {
                formData.append('facebook', this.facebook)
            }
            if (this.skype) {
                formData.append('skype', this.skype)
            }
            if (this.instagram) {
                formData.append('instagram', this.instagram)
            }
            if (this.telegram) {
                formData.append('telegram', this.telegram)
            }
            if (this.vk) {
                formData.append('vk', this.vk)
            }
            if (this.youtube) {
                formData.append('youtube', this.youtube)
            }
            if (this.site) {
                formData.append('site', this.site)
            }
            if (this.description) {
                formData.append('description', this.description)
            }
            if (this.address) {
                formData.append('address', this.address)
            }
            if (this.get_meta_title) {
                formData.append('meta_title', this.get_meta_title)
            }
            if (this.meta_keywords) {
                formData.append('meta_keywords', this.meta_keywords)
            }
            if (this.get_meta_description) {
                formData.append('meta_description', this.get_meta_description)
            }
            if (this.coords && this.coords.length > 0) {
                for (let i in this.coords) {
                    formData.append(`location[${i}]`, this.coords[i])
                }
            }
            if (this.logo) {
                if (this.logo.length > 250) {
                    var logoMimeType = this.getMimeType(this.logo)
                    var logoBlob = this.dataURL64toBlob(this.logo)
                    if (logoMimeType && logoBlob) {
                        formData.append('logo', logoBlob, logoMimeType)
                    }
                } else {
                    formData.append('logo', this.logo)
                }
            }

            await this.$http
                .put('admin/about/about', formData, {
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
                    this.$toastr.success(this.$t('about_has_been_updated'));
                    if (res && res.body && res.body.data && res.body.data.exist_translations) {
                        this.exist_translations = res.body.data.exist_translations
                        this.all_translations = res.body.data.all_translations
                    }
                    //this.forceRerender();
                })
                .catch(err => {
                    this.$toastr.error(this.$t('about_has_not_been_updated'));
                    if (err.body.message) {
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
                            this.$toastr.error(err.body.message);
                        }
                    }
                })
                .finally(end => {
                    this.progress = 0
                    this.loading = false
                })
        }
    }
}
</script>
