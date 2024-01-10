<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 title_header">
                {{ $t('deals') }}
                <v-icon
                    :color="color"
                    @click="openSearch"
                    v-if="!no_data"
                >mdi-text-box-search-outline</v-icon>
            </v-col>
        </v-row>
        <v-row v-if="search">
            <v-col cols="12">
                <v-form @submit.prevent="getDeals()">
                    <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                        <v-card flat class="px-0 mx-0">
                            <v-card-text class="px-0 mx-0">

                                <v-row>
                                    <v-col class="py-0" cols="12" sm="8">
                                        <ValidationProvider ref="deal" rules="min:1|max:255"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="deal"
                                                          type="text"
                                                          :error-messages="errors"
                                                          :disabled="loading"
                                                          outlined
                                                          :label="$t('deal_number')" color="primary"
                                                          clearable></v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col class="py-0" cols="12" sm="4">
                                        <v-dialog ref="dateDialog" v-model="dateDialog" width="290px">
                                            <v-date-picker ref="pickerDateContract" v-model="date"
                                                           :locale="lang"
                                                           @change="dateDialog = false">
                                            </v-date-picker>
                                        </v-dialog>
                                        <ValidationProvider ref="dateContract" rules="date_format"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="date" :error-messages="errors"
                                                          :error="!valid"
                                                          :disabled="loading"
                                                          :label="$t('date_created')"
                                                          outlined color="primary" readonly
                                                          @click.stop="dateDialog = !dateDialog"
                                                          clearable @click:clear="date = null"></v-text-field>
                                        </ValidationProvider>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions class="py-0">
                                <v-row>
                                    <v-col cols="12" sm="3" md="2" class="px-1 mx-0">
                                        <v-select :value="perPage" :items="perPageItems" :disabled="loading"
                                                  :label="$t('items_per_page')"
                                                  outlined
                                                  @input="perPage = options.itemsPerPage = Number($event)"
                                                  hide-details dense></v-select>
                                    </v-col>
                                    <v-col cols="12" sm="9" md="10"
                                           class="px-1 mx-0 d-flex justify-center justify-sm-end align-self-center">
                                        <v-btn type="submit" :disabled="invalid || loading"
                                               :loading="loading"
                                               :block="$vuetify.breakpoint.xsOnly" color="primary">
                                            {{ $t('search') }}
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card-actions>
                        </v-card>
                        <v-divider class="my-5"></v-divider>
                    </ValidationObserver>
                </v-form>
            </v-col>
        </v-row>
        <v-row dense v-if="!no_data">
            <v-col cols="12" class="px-0 mx-0">
                <v-card flat class="px-0 mx-0 background_color_transparent">
                    <v-card-text class="py-0 my-0 px-0 mx-0">
                        <v-data-table :headers="filteredHeaders" :items="deals" :options.sync="options" :page.sync="page"
                                      :items-per-page="perPage" :server-items-length="totalDeals"
                                      :sort-by.sync="sortBy" :sort-desc.sync="sortDir" :locale="lang"
                                      @page-count="pageCount = options.pageCount = Number($event)"
                                      class="elevation-0 cursor-pointer"
                                      hide-default-footer
                                      :hide-default-header="(!$vuetify.breakpoint.xsOnly)"
                                      :item-class="rowClass"
                                      disable-sort

                                      @click:row="handleClick"
                        >

                            <template v-slot:bottom></template>

                            <template v-slot:item.number="{ item }" class="text">
                                 <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('deal_number')}}</div>
                                 {{ item.number }}
                            </template>

                            <template v-slot:item.deal_status="{ item }" class="text">
                                <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('deal_status')}}</div>
                                {{item.deal_status}}
                            </template>
                            <template v-slot:item.date="{ item }" class="text">
                                <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('date')}}</div>
                                {{ $moment(item.date).format('DD.MM.YYYY') }}
                            </template>



                        </v-data-table>
                    </v-card-text>

                    <v-card-actions class="justify-center" v-if="(nextLink===true && loading===false) ? true : false">
                        <v-btn
                            color="primary"
                            outlined
                            class="elevation-0 "
                            @click="nextItems"
                        >
                            {{  $t('download_more') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-row v-if="no_data">
            <v-col cols="12">
                <v-card flat class="background_color_transparent">
                    <v-list-item-content>
                        <v-img style="margin: 0 auto 0 auto" max-width="500" src="img/no/dashboard.png"></v-img>
                    </v-list-item-content>
                </v-card>
            </v-col>
        </v-row>

        <v-sheet v-if="loading && deals.length === 0"
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
    import {ValidationObserver, ValidationProvider} from 'vee-validate'

    export default {
        name: "Deals",
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                progress:0,
                progress2:0,
                progress_deal:false,
                search:false,
                nextLink: true,
                color: 'primary',

                date: null,
                dateDialog: false,
                fab: false,
                deal: null,
                deals: [],
                sortBy: "id",
                sortDir: false,
                page: 1,
                pageCount: 0,
                perPage: 25,
                totalDeals: 0,
                options: {},
                loading: false,
                headers: [
                    {
                        text: this.$t('deal_number'),
                        align: "start",
                        sortable: false,
                        value: "number"
                    },
                    {
                        text: this.$t('deal_status'),
                        align: "start",
                        sortable: false,
                        value: "deal_status"
                    },
                    {
                        text: this.$t('date'),
                        align: "start",
                        sortable: false,
                        value: "date"
                    },
                ],





                deal_uuid: null,
                no_data: false

            };
        },
        computed: {
            ...mapGetters(['lang', 'itemsPerPage', 'perPageItems']),
            filteredHeaders() {
                return this.headers.filter(h => !h.hide)
            },
        },
        mounted() {
            this.getDeals()
            this.options.itemsPerPage = this.perPage = this.itemsPerPage

        },

        methods: {

            handleClick(item) {
                this.$router.push({
                    name: 'deal.show',
                    params: {
                        uuid: item.uuid
                    }
                })

            },

            rowClass(){
                //  const rowClass = (this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smOnly) ? '' : 'rowClass'
                //return 'rowClass rowDeal';
                return (!this.$vuetify.breakpoint.xsOnly) ? 'rowClass rowDeal' : 'rowMobiClass';
            },
            openSearch(){
                if(this.search === true){
                    this.search = false
                    this.color = 'primary';
                }
                else{
                    this.search = true
                    this.color = '';
                }
            },

            async getDeals() {
                var _this = this;
                this.loading = true;
                const {
                    sortBy,
                    sortDesc,
                    page,
                    itemsPerPage
                } = this.options;
                let params = {};
                if (sortBy[0] !== undefined) {
                    params.sortBy = sortBy[0];
                }
                if (sortDesc[0] !== undefined) {
                    params.sortDir = sortDesc[0] ? 'asc' : 'desc';
                }
                params.page = 1
                if (itemsPerPage !== undefined) {
                    params.perPage = itemsPerPage;
                }

                if (this.deal) {
                    params.deal = this.deal;
                }

                if (this.date) {
                    params.date = this.date;
                }

                await this.$http
                    .get("client/deal", {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.deals = res.body.data
                        this.page = res.body.meta.current_page
                        this.totalDeals = res.body.meta.total
                        this.pageCount = res.body.meta.last_page
                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }
                        if(this.deals.length <= 0){
                            this.no_data = true;
                        }
                        else{
                            this.no_data = false;
                        }
                    })
                    .catch(err => {
                        this.deals = []
                        this.totalDeals = 0
                        this.$toastr.error(this.$t('failed_to_get_list_deals'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async nextItems(){
                var _this = this;
                this.options.page++;

                this.progress_deal = true;
                const {
                    sortBy,
                    sortDesc,
                    page,
                    itemsPerPage
                } = this.options;
                let params = {};
                if (sortBy[0] !== undefined) {
                    params.sortBy = sortBy[0];
                }
                if (sortDesc[0] !== undefined) {
                    params.sortDir = sortDesc[0] ? 'asc' : 'desc';
                }
                if (page !== undefined) {

                    params.page = page

                }
                if (itemsPerPage !== undefined) {
                    params.perPage = itemsPerPage;
                }
                if (this.storage) {
                    params.storage = this.storage;
                }
                if (this.date) {
                    params.date = this.date;
                }

                await this.$http
                    .get("client/deal", {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress2 = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        let data = res.body.data;
                        data.forEach((item) => {

                            this.deals.push(item)
                        })

                        this.page = res.body.meta.current_page
                        this.totalStorages = res.body.meta.total
                        this.pageCount = res.body.meta.last_page

                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }
                        data = [];
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_list_deals'))
                    })
                    .finally(end => {
                        this.progress2 = 0
                        this.progress_deal = false
                    })


            },




        }
    }
</script>

<style>
.rowDeal td{
   width: 33.33% !important;
}
</style>

