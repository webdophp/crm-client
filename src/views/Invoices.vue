<template>
    <v-container class="align-left" :style="($vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly ) ? '' : 'float:left;max-width: 95%'">
        <v-row dense>
            <v-col cols="12" class="px-0 mx-0 title_header">
                {{ $t('search_invoice') }}
                <v-icon
                    :color="color"
                    @click="openSearch"
                    v-if="!no_data"
                >mdi-text-box-search-outline</v-icon>
            </v-col>
        </v-row>
        <v-row v-if="search">
            <v-col cols="12" class="px-0 mx-0">
                <v-form @submit.prevent="getInvoices()">
                    <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                        <v-card flat class="px-0 mx-0">
                            <v-card-text class="px-0 mx-0">

                                <v-row>
                                    <v-col class="py-0" cols="12" sm="8">
                                        <ValidationProvider ref="invoice" rules="min:1|max:255"
                                                            v-slot="{ errors, valid }">
                                            <v-text-field v-model="invoice"
                                                          type="text"
                                                          :error-messages="errors"
                                                          :disabled="loading"
                                                          outlined
                                                          :label="$t('account_number')" color="primary"
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
                        <v-data-table :headers="filteredHeaders" :items="invoices" :options.sync="options" :page.sync="page"
                                      :items-per-page="perPage" :server-items-length="totalInvoices"
                                      :sort-by.sync="sortBy" :sort-desc.sync="sortDir" :locale="lang"
                                      @page-count="pageCount = options.pageCount = Number($event)"
                                      class=" elevation-0 cursor-pointer"
                                      hide-default-footer
                                      :hide-default-header="(!$vuetify.breakpoint.xsOnly)"
                                      :item-class="rowClass"
                                      disable-sort

                                      @click:row="handleClick"
                                      >
                            <template v-slot:item.amount="{ item }">
                                <div :class="item.deleted ? 'red--text' : ''">
                                    {{ item.amount }}
                                    {{ item.deleted ? ' (' + $t('deleted') + ')' : '' }}
                                </div>
                            </template>
                            <template v-slot:item.number="{ item }" class="text">
                                 <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('account_number')}}</div>
                                 № {{ item.number }}
                            </template>
                            <template v-slot:item.amount="{ item }" class="text">
                                <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('amount')}}</div>
                                {{ item.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') }} {{ $t('tg') }}
                            </template>
                            <template v-slot:item.invoice_status="{ item }" class="text">
                                <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('invoice_status')}}</div>
                                {{item.invoice_status}}
                            </template>
                            <template v-slot:item.date="{ item }" class="text">
                                <div v-if="(!$vuetify.breakpoint.xsOnly)" class="title">{{$t('date')}}</div>
                                {{ $moment(item.date).format('DD.MM.YYYY') }}
                            </template>
                            <template v-slot:item.to_pay="{ item }">
                                <v-btn
                                    :class="!$vuetify.breakpoint.xsOnly  ? 'mt-4 mb-3' : ''"
                                    v-if="item.invoice_status_id <= 2"

                                        outlined
                                       color="primary"
                                       @click="toPay(item)"
                                     >
                                    {{ $t('to_pay') }}
                                </v-btn>
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
                        <v-img style="margin: 0 auto 0 auto" max-width="500" src="img/no/invoice.png"></v-img>
                    </v-list-item-content>
                </v-card>
            </v-col>
        </v-row>




        <v-dialog
            v-if="document.request_scanned"
            v-model="dialog_file"
            scrollable

            max-width="500px"


        >
            <v-card>
                <v-card-title class="px-2 mx-0">
                    <v-icon @click="dialog_file = false;document={}">mdi-close</v-icon>
                    <span class="pl-5">{{ $t('payment_invoice') }}</span>


                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list subheader>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ document.number }}</v-list-item-title>
                                <v-list-item-subtitle>{{ $t('account_number')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{ document.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') }} {{ $t('tg') }}
                                </v-list-item-title>
                                <v-list-item-subtitle>{{$t('amount')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ document.invoice_status }}</v-list-item-title>
                                <v-list-item-subtitle>{{$t('invoice_status')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>{{ $moment(document.date).format('DD.MM.YYYY') }}</v-list-item-title>
                                <v-list-item-subtitle> {{$t('date')}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>


                            <v-list-item-content>
                                <v-list-item-title v-text="document.request_scanned.file_name"></v-list-item-title>
                                <v-list-item-subtitle v-text="(document.request_scanned.size / 1000).toFixed(1) + ' KB'"></v-list-item-subtitle>
                            </v-list-item-content>


                        </v-list-item>


                    </v-list>


                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="downloadFile(document.request_scanned)"
                    >
                        {{$t('download')}}
                    </v-btn>
                </v-card-actions>


            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialog_answer"
            scrollable

            max-width="500px"


        >
            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                <v-card>
                    <v-card-title class="px-2 mx-0">
                        <v-icon @click="closeDialogAnswer">mdi-close</v-icon>
                        <span class="pl-5">{{ $t('confirm_payment') }}</span>


                    </v-card-title>
                    <v-divider></v-divider>


                    <v-card-text>
                        <div class="mt-5 font-weight-bold">{{ $t('upload_title') }}</div>
                        <div class="my-1">{{ $t('upload_text_1') }}</div>
                        <div class="my-1">{{ $t('upload_text_2') }}</div>
                        <div class="my-1">{{ $t('upload_text_3') }}</div>
                        <div class="my-1">{{ $t('upload_text_4') }}</div>
                        <div class="my-2 pb-5" v-html="$t('upload_text_attention')"></div>

                        <div v-if="!answer_scanned_document.file_name">
                            <ValidationProvider ref="answer_scanned" rules="required"
                                                v-slot="{ errors, valid }">
                                <v-file-input  v-model="answer_scanned"
                                               accept=".pdf"
                                               outlined
                                               :error="!valid" :error-messages="errors"
                                               :disabled="loading"
                                               :label="$t('select_file_pdf')"
                                               class="mb-0 pb-0"
                                               @change="previewAnswerScanned"
                                ></v-file-input>
                            </ValidationProvider>
                        </div>
                        <div class="mt-0 pt-0" v-if="answer_scanned_document.file_name">
                            <v-list subheader >
                                <v-list-item class="px-0 mx-0"  @click="downloadFile(answer_scanned_document)">
                                    <v-list-item-icon>
                                        <v-img
                                            max-width="90"
                                            :alt="answer_scanned_document.file_name"
                                            :src="answer_scanned_document.url"
                                            max-height="60"
                                        ></v-img>
                                        <v-icon
                                            x-large
                                            v-if="!mimeTypeImage(answer_scanned_document.file_type)">mdi-file-document-outline mdi-48px</v-icon>
                                    </v-list-item-icon>

                                    <v-list-item-content>
                                        <v-list-item-title v-text="answer_scanned_document.file_name"></v-list-item-title>
                                        <v-list-item-subtitle v-text="(answer_scanned_document.size / 1000).toFixed(1) + ' KB'"></v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-icon class="d-flex align-self-center mt-2">
                                        <v-btn
                                            icon
                                            @click="clearAnswerScanned"
                                        >
                                            <v-icon> mdi-delete-outline</v-icon>
                                        </v-btn>

                                    </v-list-item-icon>
                                </v-list-item>
                            </v-list>
                        </div>

                    </v-card-text>


                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn

                            text
                            @click="closeDialogAnswer"
                        >
                            {{ $t('cancel')}}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="!answer_scanned_document.file_name || new_answer_scanned === 1"
                            color="primary"
                            text
                            @click="addInvoice"

                            :disabled="invalid || loading" :loading="loading"
                        >
                            {{$t('upload')}}
                        </v-btn>
                    </v-card-actions>


                </v-card>
            </ValidationObserver>

        </v-dialog>


        <v-sheet v-if="loading && invoices.length === 0"
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
        name: "Invoices",
        components: {
            ValidationProvider,
            ValidationObserver
        },
        data() {
            return {
                loading2:true,
                progress:0,
                progress2:0,
                progress_shop:false,
                search:false,
                nextLink: true,
                color: 'primary',

                date: null,
                dateDialog: false,
                fab: false,
                invoice: null,
                invoices: [],
                invoiceItems: [],
                sortBy: "id",
                sortDir: false,
                page: 1,
                pageCount: 0,
                perPage: 25,
                totalVisiblePag: 5,
                totalInvoices: 0,
                options: {},
                loading: false,
                headers: [
                    {
                        text: this.$t('account_number'),
                        align: "start",
                        sortable: false,
                        value: "number"
                    },
                    {
                        text: this.$t('amount'),
                        align: "start",
                        sortable: false,
                        value: "amount"
                    },
                    {
                        text: this.$t('invoice_status'),
                        align: "start",
                        sortable: false,
                        value: "invoice_status"
                    },
                    {
                        text: this.$t('date'),
                        align: "start",
                        sortable: false,
                        value: "date"
                    },
                    {
                        text: this.$t('to_pay'),
                        align: "right",
                        sortable: false,
                        width: 50,
                        value: "to_pay"
                    }
                ],
                dialog_file:false,
                dialog_answer:false,
                document:{},
                answer_scanned_document : {},
                answer_scanned : null,
                new_answer_scanned: 0,
                invoice_uuid: null,
                no_data: false,
                params: null,

            };
        },
        computed: {
            ...mapGetters(['lang', 'itemsPerPage', 'perPageItems']),
            filteredHeaders() {
                return this.headers.filter(h => !h.hide)
            },
        },
        mounted() {
            this.getInvoices()
            this.options.itemsPerPage = this.perPage = this.itemsPerPage

        },

        methods: {
            closeDialogAnswer(){
                this.dialog_answer = false;
                this.answer_scanned_document={};
                this.answer_scanned=null;
                this.new_answer_scanned = 0;
                this.invoice_uuid = null;
            },
            clearAnswerScanned(){
                this.answer_scanned  = null
                this.answer_scanned_document  = {}

            },
            previewAnswerScanned() {
                let document = this.answer_scanned;
                this.answer_scanned_document = {}
                this.answer_scanned_document.url = URL.createObjectURL(document)
                this.answer_scanned_document.file_name = document.name
                this.answer_scanned_document.blob =  document
                this.answer_scanned_document.size = document.size
                this.answer_scanned_document.file_type = document.type
                this.new_answer_scanned = 1;
            },
            toPay(item){
                this.answer_scanned_document = item.answer_scanned ?? {}
                this.dialog_answer  = true;
                this.invoice_uuid = item.uuid;
                this.params = item.params;
            },
            handleClick(item) {
                if(this.dialog_answer === false){
                    this.document = {};
                    this.dialog_file = true;
                    this.document = item;
                }

            },

            rowClass(){
                //  const rowClass = (this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smOnly) ? '' : 'rowClass'
                return (!this.$vuetify.breakpoint.xsOnly) ? 'rowClass' : 'rowMobiClass';
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

            async getInvoices() {
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

                if (this.invoice) {
                    params.invoice = this.invoice;
                }

                if (this.date) {
                    params.date = this.date;
                }

                await this.$http
                    .get("client/invoice", {
                        params: params,
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {

                        this.invoices = res.body.data
                        this.page = res.body.meta.current_page
                        this.totalInvoices = res.body.meta.total
                        this.pageCount = res.body.meta.last_page
                        if(this.pageCount === this.page){
                            this.nextLink = false;
                        }
                        else{
                            this.nextLink = true;
                        }
                        if(this.invoices.length <= 0){
                            this.no_data = true;
                        }
                        else{
                            this.no_data = false;
                        }
                    })
                    .catch(err => {
                        this.invoices = []
                        this.totalInvoices = 0
                        this.$toastr.error(this.$t('failed_to_get_list_invoices'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
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
                    .get("client/invoice", {
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

                            this.invoices.push(item)
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
                        this.$toastr.error(this.$t('failed_to_get_list_invoices'))
                    })
                    .finally(end => {
                        this.progress2 = 0
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
                        a.download = data.file_name;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        this.$toastr.success(this.$t('file_download_started'))
                    })
                    .catch(() =>
                        this.$toastr.error(this.$t('file_download_error'))

                    );
            },

            async addInvoice(){

                var _this = this;
                this.progress = 0
                this.loading = true
                var formData = new FormData()

                if (this.new_answer_scanned) {
                    formData.append('new_answer_scanned', 1)
                }

                if (this.params && this.params.topic_uuid) {
                    formData.append('topic_uuid', this.params.topic_uuid)
                }
                if (this.params && this.params.topic_id) {
                    formData.append('topic_id', this.params.topic_id)
                }
                if (this.params && this.params.chat_id) {
                    formData.append('id_array', -1)
                }
                if (this.params && this.params.chat_uuid) {
                    formData.append('message_uuid', this.params.chat_uuid)
                }
                if (this.answer_scanned_document.size) {
                    formData.append('answer_size', this.answer_scanned_document.size)
                }
                if (this.answer_scanned_document.file_name) {
                    formData.append('answer_file_name', this.answer_scanned_document.file_name)
                }
                if (this.answer_scanned_document.file_type) {
                    formData.append('answer_file_type', this.answer_scanned_document.file_type)
                }
                if (this.answer_scanned) {
                    formData.append('answer_scanned', this.answer_scanned)
                }


                await this.$http
                    .put(`client/invoice/${this.invoice_uuid}`, formData, {
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
                        this.$toastr.success(this.$t('invoice_has_been_updated'))
                        _this.closeDialogAnswer();
                        _this.getInvoices()
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('invoice_has_not_been_updated'))
                        if (err && err.body && err.body.message) {
                            for (let prop in err.body.errors) {
                                _this.clearAnswerScanned();
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

            }

        }
    }
</script>

