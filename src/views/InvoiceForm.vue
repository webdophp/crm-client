<template>
    <v-container fluid>
         <v-form @submit.prevent="saveInvoice">
            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
                <v-card flat>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12">
                                <v-row class="flex-nowrap">
                                    <v-col cols="1" style="max-width: 80px">
                                        <v-btn :to="{name: 'invoice'}" class="back-btn" link large>
                                            <v-icon>mdi-less-than</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="11">
                                        <v-subheader class="headline">{{ heading }}</v-subheader>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>

                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="client" rules="required|min:1"
                                                    v-slot="{ errors, valid }">
                                    <v-autocomplete v-model="client" :items="clientItems"
                                                    :error-messages="errors" :error="!valid"
                                                    :search-input.sync="clientSearching"
                                                    item-text="name" item-value="id"
                                                    prepend-icon="mdi-account"
                                                    append-icon="mdi-location-enter"
                                                    :loading="loadingClients" :disabled="loading"
                                                    :no-data-text="clientSearching ? $t('nothing_found_by',{'search': clientSearching}) : $t('nothing_found_name')"
                                                    :label="$t('client')"
                                                    @click:clear="clientItems=[]"
                                                    @click="clearClients"
                                                    @click:append="redirectToClient(client)"
                                                    color="primary" clearable autocomplete="off">
                                        <template v-slot:item="{ attrs, item, parent, selected }">
                                            <span class="search-list">
                                                <span v-html="item.name"></span>
                                                <span class="ml-2 hidden-is-empty"
                                                      v-text="item.phone"></span>
                                            </span>
                                        </template>
                                        <template v-slot:selection="{ attrs, item, parent, selected }">
                                            <span class="search-list">
                                                <span v-html="item.name"></span>
                                                <span class="ml-2 hidden-is-empty"
                                                      v-text="item.address_legal"></span>
                                            </span>
                                        </template>
                                    </v-autocomplete>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="amount" rules="required|numeric|min_value:0"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="amount" type="text"
                                                  :error="!valid" :error-messages="errors"
                                                  :disabled="loading" prepend-icon="mdi-account-cash-outline"
                                                  :label="$t('amount')" color="primary"
                                                  clearable>
                                    </v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <v-dialog ref="dateDialogContract" v-model="dateDialogContract" width="290px">
                                    <v-date-picker ref="pickerDateContract" v-model="date_invoice"
                                                   first-day-of-week="1" :locale="lang"
                                                   @change="dateDialogContract = false">
                                    </v-date-picker>
                                </v-dialog>
                                <ValidationProvider ref="dateContract" rules="required|date_format"
                                                    v-slot="{ errors, valid }">
                                    <v-text-field v-model="date_invoice" :error-messages="errors"
                                                  :error="!valid" :disabled="loading"
                                                  :label="$t('date_invoice')"
                                                  prepend-icon="mdi-calendar" color="primary" readonly
                                                  @click.stop="dateDialogContract = !dateDialogContract"
                                                  clearable @click:clear="date_invoice = null"></v-text-field>
                                </ValidationProvider>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6">
                                <ValidationProvider ref="invoice_status" rules="required"
                                                    v-slot="{ errors, valid }">
                                    <v-select v-model="invoice_status" :disabled="loading"
                                              :items="invoice_statusItems" :error-messages="errors"
                                              prepend-icon="mdi-cash-check" :error="!valid"
                                              color="primary" item-text="name" item-value="id"
                                              :label="$t('invoice_status')" clearable></v-select>
                                </ValidationProvider>
                            </v-col>

                            <v-col class="py-0" cols="12" sm="12">
                                <ValidationProvider ref="request_scanned" rules="required"
                                                    v-slot="{ errors, valid }">

                                    <v-file-input class="my-2" v-model="request_scanned"
                                                  counter
                                                  accept=".pdf"
                                                  :disabled="loading"
                                                  :error="!valid"
                                                  :label="$t('request_scanned')"
                                                  truncate-length="11"
                                    ></v-file-input>

                                </ValidationProvider>
                            </v-col>

                            <v-col class="py-0" cols="12" sm="12">
                                <ValidationProvider ref="answer_scanned" rules="min:1"
                                                    v-slot="{ errors, valid }">

                                    <v-file-input class="my-2" v-model="answer_scanned"
                                                  counter
                                                  accept=".pdf"
                                                  :disabled="loading"
                                                  :error="!valid"
                                                  :label="$t('answer_scanned')"
                                                  truncate-length="11"
                                    ></v-file-input>

                                </ValidationProvider>
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
    import {mapGetters} from "vuex"
    import debounce from "lodash/debounce"

    export default {
        name: 'InvoiceForm',
        components: {
            ValidationProvider,
            ValidationObserver,
        },
        inject: ['forceRerender'],
        data() {
            return {
                heading: null,
                progress: 0,
                date_invoice: null,
                dateDialogContract: false,
                amount: null,
                loading: false,
                invoice_status: null,
                invoice_statusItems: [],
                client: null,
                clientItems: [],
                clientSearching: null,
                loadingClients: false,
                request_scanned: null,
                answer_scanned: null,
            }
        },
        computed: {
            ...mapGetters(['lang']),

        },
        watch: {
            clientSearching: debounce(function (val) {
                if (val && !this.client) {
                    this.getClients(val)
                }
            }, 500)
        },
        mounted() {
            this.getInvoiceStatuses()
            this.checkCreate();
        },
        methods: {
            checkCreate() {
                if (this.$route.name === "invoice.create") {
                    this.heading = this.$t('invoice_creation')
                } else {
                    this.heading = this.$t('invoice_editing')
                    if (this.$route.params.id) {
                        this.getInvoice(this.$route.params.id)
                    }
                }
            },
            async getInvoiceStatuses() {
                let params = {};
                params.filter = 'all';
                await this.$http
                    .get(`admin/invoice_status`, {
                        params: params,
                    })
                    .then(res => {
                        this.invoice_statusItems = res.body.data
                    })
                    .catch(err => {
                        this.invoice_statusItems = [];
                        this.$toastr.error(this.$t('failed_to_get_list_invoice_statuses'))
                    });
            },
            async getInvoice(id) {
                var _this = this;
                this.progress = 0
                this.loading = true
                this.id = id
                await this.$http
                    .get(`admin/invoice/${id}`, {
                        progress(e) {
                            if (e.lengthComputable) {
                                _this.progress = Math.round((e.loaded / e.total) * 100)
                            }
                        }
                    })
                    .then(res => {
                        this.amount = res.body.data.amount
                        this.phoneRaw = res.body.data.phone
                        this.date_invoice = res.body.data.date_invoice
                        let client = res.body.data.client
                        if (client && client.id) {
                            this.client = client.id
                            this.clientItems = [res.body.data.client]
                        } else {
                            this.clientItems = []
                        }
                        this.invoice_status = res.body.data.invoice_status
                        this.request_scanned  = new File([atob(res.body.data.request_scanned_base64)], res.body.data.request_scanned, {
                            type: "application/pdf",
                        })
                        this.answer_scanned  = new File([atob(res.body.data.answer_scanned_base64)], res.body.data.answer_scanned, {
                            type: "application/pdf",
                        })

                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('failed_to_get_invoice'))
                    })
                    .finally(end => {
                        this.progress = 0
                        this.loading = false
                    })
            },
            async saveInvoice() {

                    var _this = this;
                    this.progress = 0
                    this.loading = true
                    var formData = new FormData()
                    if (this.amount) {
                        formData.append('amount', this.amount)
                    }
                    if (this.date_invoice) {
                        formData.append('date_invoice', this.date_invoice)
                    }
                    if (this.invoice_status) {
                        formData.append('invoice_status', this.invoice_status)
                    }
                    if (this.request_scanned) {
                        formData.append('request_scanned', this.request_scanned)
                    }
                    if (this.answer_scanned) {
                        formData.append('answer_scanned', this.answer_scanned)
                    }

                    if (this.client) {
                        if (this.client.id) {
                            formData.append('client', this.client.id)
                        } else {
                            formData.append('client', this.client)
                        }
                    }



                    if (this.$route.params.id) {
                        await this.$http
                            .put(`admin/invoice/${this.$route.params.id}`, formData, {
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
                                if (res && res.body && res.body.data && res.body.data.exist_translations) {
                                    this.exist_translations = res.body.data.exist_translations
                                    this.all_translations = res.body.data.all_translations
                                }
                                //this.forceRerender()
                            })
                            .catch(err => {
                                this.$toastr.error(this.$t('invoice_has_not_been_updated'))
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
                    }
                    else {
                        // Add
                        await this.$http
                            .post('admin/invoice', formData, {
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
                                this.$toastr.success(this.$t('invoice_has_been_added'))
                                if (res && res.body && res.body.data && res.body.data.id) {
                                    this.exist_translations = res.body.data.exist_translations
                                    this.all_translations = res.body.data.all_translations
                                    this.$router.push({
                                        name: 'invoice.edit',
                                        params: {
                                            id: res.body.data.id
                                        }
                                    })
                                } else {
                                    this.$router.push({
                                        name: 'invoice'
                                    })
                                }
                                //this.forceRerender()
                            })
                            .catch(err => {
                                this.$toastr.error(this.$t('invoice_has_not_been_added'))
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
                    }

            },
            async getClients(str) {
                if (str) {
                    this.loadingClients = true
                    let params = {}
                    params.filter = 'search'
                    if (str !== 'undefined') {
                        params.client = str
                    }
                    await this.$http
                        .get("admin/client", {
                            params: params,
                        })
                        .then(res => {
                            this.clientItems = res.body.data
                        })
                        .catch(err => {
                            this.clientItems = []
                        })
                        .finally(end => {
                            this.loadingClients = false
                        })
                }
            },
            clearClients() {
                if (!this.client) {
                    this.clientItems = []
                }
            },
            redirectToClient(val) {
                if (val) {
                    this.$router.push({
                        name: 'client.profile',
                        params: {
                            id: val
                        }
                    })
                }
            },

        }
    }
</script>
