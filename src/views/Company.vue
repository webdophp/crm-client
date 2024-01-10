<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 title_header">
                {{ $t('company') }}
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0">
                <v-card flat class="px-0 mx-0 ">
                    <v-card-text class="py-0 my-0 px-0 mx-0">
                        <v-data-table
                            :headers="headers"
                            :items="desserts"
                            :items-per-page="55"

                            hide-default-header
                            hide-default-footer
                            :item-class="rowClass"
                            :hide-default-header="(!$vuetify.breakpoint.xsOnly)"
                            class="rounded-lg tableCompanyBorder"
                        >

                            <template v-slot:item.name="{ item }">
                                <div class="col_name" v-if="item.name.title">
                                    {{ item.name.title }}
                                    <v-tooltip bottom max-width="300" color="#242424">
                                        <template v-slot:activator="{ on }">
                                            <v-icon
                                                small
                                                v-on="on"
                                                class="mr-2 cursor-pointer">
                                                mdi-message-question
                                            </v-icon>
                                        </template>
                                        <span >{{ item.name.tooltip }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="company_table_header" v-if="!item.name.title">
                                    {{ item.name }}
                                </div>
                            </template>
                            <template v-slot:item.category="{ item }">

                                <div class="col_name" v-if="item.category && item.category.copy" >
                                    {{ item.category.title }}

                                            <v-icon

                                                color="#B3B3B3"
                                                small
                                                :title="$t('copy')"
                                                @click="copyText(item.category.title)"
                                                class="mr-2 cursor-pointer">
                                                mdi-content-copy
                                            </v-icon>

                                </div>
                                <div class="col_name" v-if="item.category && !item.category.copy" >
                                    {{ item.category }}
                                </div>
                            </template>

                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-sheet v-if="loading && desserts.length === 0"
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
    </v-container>
</template>
<script>


    import {mapGetters} from "vuex"


    export default {
        name: 'Company',
        inject: ['forceRerender'],
        data() {
            return {
                headers: [
                    {
                        text: null,
                        align: 'start',
                        value: 'name',
                        sortable: false,
                    },
                    {
                        text: null,
                        value: 'category',
                        sortable: false,
                    },
                ],
                desserts: [],

                heading: null,
                progress: 0,
                tab: 0,

                logo: null,
                loading: false,


            }
        },
        computed: {
            ...mapGetters(['listLanguages', 'lang']),
            languages() {
                return this.listLanguages
            },
        },
        mounted() {
            this.language = this.languages[this.tab]
            this.checkCreate();
        },
        methods: {
            copyText(text) {
                navigator.clipboard.writeText(text);
            },
            rowClass(){
                const rowClass = (this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smOnly) ? 'rowMobiCompany' : 'rowCompany'
                return rowClass;
            },
            async setLanguage(val) {
                this.language = this.languages[val]
                await this.checkCreate()
            },
            checkCreate() {
                this.getCompany();
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
                    .get(`client/company`, {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.desserts  =
                        [
                            {
                                name: this.$t('company_name'),
                                category: {
                                    'title': res.body.data.name,
                                    'copy': 1,
                                }
                            },
                            {

                                name: this.$t('company_name_legal'),
                                // name: {
                                //     'title': this.$t('company_name_legal'),
                                //     'tooltip': 'UEN stands for Unique Entity Number. It is a standard identification number for entities to interact with government agencies.',
                                // } ,
                                category: res.body.data.name_legal
                            },
                            {
                                name: this.$t('property'),
                                category: res.body.data.form_property_name
                            },
                            {
                                name: this.$t('name_director'),
                                category: res.body.data.name_director
                            },
                            {
                                name: this.$t('address_actually'),
                                category: res.body.data.address_actually
                            },
                            {
                                name: this.$t('address_legal'),
                                category: {
                                    'title': res.body.data.address_legal,
                                    'copy': 1,
                                }
                            },
                            // {
                            //     name: this.$t('contract_number'),
                            //     category: res.body.data.contract_number
                            // },
                            {
                                name: this.$t('phone'),
                                category:  {
                                    'title': res.body.data.phone,
                                    'copy': 1,
                                }
                            },
                            // {
                            //     name: this.$t('checking_account'),
                            //     category: res.body.data.checking_account
                            // },
                            {
                                name: this.$t('additional_phone'),
                                category: res.body.data.phone_additional
                            },
                            {
                                name: this.$t('bin_iin'),
                                category: {
                                     'title': res.body.data.bin_iin,
                                     'copy': 1,
                                }
                            },
                            {
                                name: this.$t('email'),
                                category: {
                                    'title': res.body.data.email,
                                    'copy': 1,
                                }
                            },
                            {
                                name: this.$t('date_contract'),
                                category: res.body.data.date_contract
                            },
                        ]

                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_company'));
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },

        }
    }
</script>
