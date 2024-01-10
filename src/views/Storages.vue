<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 title_header">
                {{ $t('menu_storage') }}
                <v-icon :color="color" v-if="!no_data" @click="openSearch">mdi-image-search</v-icon>
            </v-col>
        </v-row>
        <v-row v-if="search">
            <v-col cols="12">
                <v-form @submit.prevent="getStorages('search')">
                    <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                        <v-card flat class="px-0 mx-0">
                            <v-card-text class="px-0 mx-0">

                                <v-row>
                                    <v-col class="py-0" cols="12" sm="8">
                                        <ValidationProvider ref="storage" rules="min:1|max:255"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="storage"
                                                          type="text"
                                                          :error-messages="errors"
                                                          :disabled="loading"
                                                          outlined
                                                          :label="$t('name')" color="primary"
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
                        <v-data-table :headers="filteredHeaders" :items="storages" :options.sync="options"
                                      :page.sync="page" :items-per-page="perPage" :server-items-length="totalStorages"
                                      :sort-by.sync="sortBy" :sort-desc.sync="sortDir"  :locale="lang"
                                      @page-count="pageCount = options.pageCount = Number($event)"

                                      class="elevation-0 cursor-pointer"
                                      hide-default-footer
                                      :hide-default-header="(!$vuetify.breakpoint.xsOnly)"
                                      :item-class="rowClass"
                                      disable-sort


                        >

                            <template v-slot:item.url="{ item }" class="mb-3">
                                <div style="max-width: 24px">
                                    <v-img :class="(!$vuetify.breakpoint.xsOnly) ? 'mt-5' : ''" v-if="mimeTypeImage(item.type_mime)"
                                            :src="item.url"
                                            height="24" width="24"></v-img>

                                    <v-icon class="mt-5"
                                            width="24"
                                            v-if="!mimeTypeImage(item.type_mime)">${{'documentIcon'}}</v-icon>
                                </div>
                            </template>
                            <template v-slot:item.name="{ item }" class="text">
                                <div>
                                    <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('name')}}</div>
                                    {{ item.name }}
                                </div>
                            </template>
                            <template v-slot:item.created_at="{ item }" class="text">
                                <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('date')}}</div>
                                {{ $moment(item.created_at).format('DD.MM.YYYY') }}
                            </template>
                            <template v-slot:item.time="{ item }" class="text">
                                <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('time')}}</div>
                                {{ $moment(item.time).format('HH:mm') }}
                            </template>
                            <template v-slot:item.action="{ item }" class="text">
                                <v-btn
                                    :class="(!$vuetify.breakpoint.xsOnly) ? 'mt-4' : ''"
                                    @click="downloadFile(item)"
                                    target="_blank"
                                    icon>
                                    <v-icon size="26">${{'fileDownloadIcon'}}</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-text>
                        <v-progress-linear v-model="progress2"
                                            :active="progress_shop" class="mr-2"></v-progress-linear>
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
                        <v-img style="margin: 0 auto 0 auto" max-width="500" src="img/no/storage.png"></v-img>
                    </v-list-item-content>
                </v-card>
            </v-col>
        </v-row>

        <v-sheet v-if="loading && storages.length === 0"
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

    import { mapGetters } from "vuex"
    import { ValidationObserver, ValidationProvider } from 'vee-validate'
    import debounce from "lodash/debounce";

    export default {
        name: "Storages",
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                progress:0,
                progress2:0,
                progress_shop:false,
                date: null,
                search: false,
                nextLink: true,
                color: 'primary',
                dateDialog: false,
                storage: null,
                storages: [],
                sortBy: "id",
                sortDir: false,
                page: 1,
                pageCount: 0,
                perPage: 25,
                totalVisiblePag: 5,
                totalStorages: 0,
                options: {},
                loading: false,
                headers: [
                    {
                        text: this.$t('review'),
                        align: "start",
                        sortable: false,
                        value: "url",
                        width: 24,
                        cellClass: "td_icon"
                    },
                    {
                        text: this.$t('name'),
                        align: "start",
                        sortable: false,
                        value: "name"
                    },
                    {
                        text: this.$t('date'),
                        align: "start",
                        sortable: false,
                        value: "created_at"
                    },
                    {
                        text: this.$t('time'),
                        align: "start",
                        sortable: false,
                        value: "time"
                    },

                    {
                        text: this.$t('download'),
                        align: "right",
                        value: 'action',
                        sortable: false,
                        width: 100,
                    },
                ],
                no_data: false,
            };
        },
        computed: {
            ...mapGetters(['lang', 'itemsPerPage', 'perPageItems']),
            filteredHeaders() {
                return this.headers.filter(h => !h.hide)
            },
        },
        mounted() {
            this.getStorages()
            this.options.itemsPerPage = this.perPage = this.itemsPerPage
        },
        // watch: {
        //     options: {
        //         handler() {
        //             this.getStorages()
        //         },
        //         deep: false
        //     }
        // },
        methods: {
            async getStorages() {
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
                if (this.storage) {
                    params.storage = this.storage;
                }
                if (this.date) {
                    params.date = this.date;
                }

                await this.$http
                    .get("client/storage", {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.storages = res.body.data
                        this.page = res.body.meta.current_page
                        this.totalStorages = res.body.meta.total
                        this.pageCount = res.body.meta.last_page
                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }
                        if(this.storages.length <= 0){
                            this.no_data = true;
                        }
                        else{
                            this.no_data = false;
                        }
                    })
                    .catch(err => {
                        this.storages = []
                        this.totalStorages = 0
                        this.$toastr.error(this.$t('failed_to_get_list_storages'))
                    })
                    .finally(end => {
                        this.loading = false
                    })
            },
            rowClass(){
              //  const rowClass = (this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smOnly) ? '' : 'rowClass'
                //return 'rowClass rowStorage';
                return (!this.$vuetify.breakpoint.xsOnly) ? 'rowClass rowStorage' : 'rowMobiClass';
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
            async nextItems(){
                var _this = this;
                this.options.page++;
                this.progress_shop = true;
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
                    .get("client/storage", {
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
                            this.storages.push(item)
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
                        this.$toastr.error(this.$t('failed_to_get_list_storages'))
                    })
                    .finally(end => {
                        this.progress2 = 0;
                        this.progress_shop = false
                    })


            },
            downloadFile(data) {
                fetch(data.url)
                    .then((resp) => resp.blob())
                    .then((blob) => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.style.display = "none";
                        a.href = url;
                        a.download = data.name;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        this.$toastr.success(this.$t('file_download_started'))
                    })
                    .catch(() =>
                        this.$toastr.error(this.$t('file_download_error'))

                    );
            },
        }
    }
</script>

<style>
.td_icon{
    width: 30px;

}

.rowStorage td:nth-child(1){
  width: 5% !important;
}
.rowStorage td:nth-child(2){
    width: 68% !important;
}
.rowStorage td:nth-child(3){
    width: 12% !important;
}
.rowStorage td:nth-child(4){
    width: 9% !important;
}
.rowStorage td:nth-child(5){
    width: 4% !important;
}
</style>

