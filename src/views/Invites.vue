<template>
    <v-container fluid>
        <v-form @submit.prevent="getInvites('search')">
            <v-btn v-show="$vuetify.breakpoint.xsOnly" :to="{name: 'invite.create'}"
                   color="indigo" fab fixed top right class="v-btn--add-form-top white--text">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
                <v-card flat>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="8">
                                <v-subheader class="headline">{{ $t('search_invite') }}</v-subheader>
                            </v-col>
                            <v-col v-if="!$vuetify.breakpoint.xsOnly" cols="12" sm="4" class="text-right">
                                <v-btn  @click="dialogAdd=true" class="white--text" color="indigo">
                                    {{$t('create') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="py-0" cols="12" sm="12">

                                    <v-text-field v-model="email_search" type="email_search"
                                                  :disabled="loading"
                                                  prepend-icon="mdi-email" :label="$t('email')"
                                                  color="primary" clearable>
                                    </v-text-field>

                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions class="px-4 py-4">
                        <v-row>
                            <v-col cols="12" sm="3" md="2">
                                <v-select :value="perPage" :items="perPageItems" :disabled="loading"
                                          :label="$t('items_per_page')" prepend-icon="mdi-counter"
                                          @input="perPage = options.itemsPerPage = Number($event)" hide-details
                                          dense></v-select>
                            </v-col>
                            <v-col cols="12" sm="9" md="10"
                                   class="d-flex justify-center justify-sm-end align-self-center">
                                <v-btn type="submit" :disabled="loading" :block="$vuetify.breakpoint.xsOnly"
                                       color="primary">{{ $t('search') }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>

                <v-card flat>
                    <v-card-text class="px-4">
                        <v-data-table :headers="filteredHeaders" :items="invites" :options.sync="options" :page.sync="page"
                                      :items-per-page="perPage" :server-items-length="totalInvites"
                                      :sort-by.sync="sortBy" :sort-desc.sync="sortDir" :loading="loading" :locale="lang"
                                      @page-count="pageCount = options.pageCount = Number($event)"
                                      :loading-text="$t('loading_please_wait')" class="elevation-1"
                                      hide-default-footer>
                            <template v-slot:item.name="{ item }">
                                <div :class="item.deleted ? 'red--text' : ''">
                                    {{ item.name }}
                                    {{ item.deleted ? ' (' + $t('deleted') + ')' : '' }}
                                </div>
                            </template>
                            <template v-slot:item.accepted="{ item }">
                                {{ item.accepted ? $t('yes') : $t('no')}}
                            </template>
                            <template v-slot:item.sent_date="{ item }">
                                {{ $moment(item.sent_date).format('DD.MM.YYYY HH:mm:ss') }}
                            </template>
                            <template v-slot:item.action="{ item }">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" class="mr-2" @click="detailsInvite(item)" :title="$t('details')">
                                            mdi-card-text-outline
                                        </v-icon>
                                    </template>
                                    <span>{{$t('invite_details')}}</span>
                                </v-tooltip>


                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" :disabled="item.deleted" @click="deleteInvite(item)" icon>
                                            <v-icon>mdi-delete-outline</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ item.deleted ? $t('remotely') : $t('delete') }}</span>
                                </v-tooltip>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                        <v-pagination v-model="page" :total-visible="totalVisiblePag"
                                      :length="pageCount" :disabled="loading"></v-pagination>
                    </v-card-actions>
                </v-card>


        <v-dialog v-if="dialogAdd" v-model="dialogAdd"  width="500">

            <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">

                <v-card>
                    <v-card-title class="text-h5 primary lighten-2">
                        {{ $t('invite_creation') }}
                    </v-card-title>

                    <v-card-text class="my-2 py-2">
                        <v-col class="py-0" cols="12">
                            <ValidationProvider ref="email" rules="required|email|min:5|max:50"
                                                v-slot="{ errors, valid }">
                                <v-text-field v-model="email" type="email"
                                              :error-messages="errors" :error="!valid"
                                              :disabled="loading || !can(['administrator', 'manager'])"
                                              :readonly="!can(['administrator', 'manager'])"
                                              prepend-icon="mdi-email" label="Email"
                                              color="primary" clearable>
                                </v-text-field>
                            </ValidationProvider>
                        </v-col>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text @click="closeDialogAdd()">
                            {{ $t('cancel')}}
                        </v-btn>
                        <v-btn color="darken-1" text @click="sentInvite()">
                            {{ $t('sent')}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </ValidationObserver>
        </v-dialog>

        <v-dialog v-if="dialogDetails" v-model="dialogDetails" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>{{ $t('invite_details') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn icon dark @click="cancelDetails()">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text class="my-2 py-2" >
                    <v-row>
                        <v-col cols="12"><b> {{ $t('accepted')}}: </b>{{ detail.accept_date ? $t('yes') : $t('no') }}</v-col>
                        <v-col cols="12"><b> {{ $t('email')}}: </b>{{ detail.email ? detail.email :  $t('no_data')  }}</v-col>
                        <v-col cols="12"><b> {{ $t('sent_date')}}: </b>{{ detail.sent_date ?  $moment(detail.sent_date).format('DD.MM.YYYY HH:mm:ss')  :  $t('no_data')  }}</v-col>
                        <v-col cols="12" v-if="detail.client && detail.client.name ? true : false"><b> {{ $t('accept_date')}}: </b>{{ detail.accept_date ? $moment(detail.accept_date).format('DD.MM.YYYY HH:mm:ss') :  $t('no_data')  }}</v-col>
                        <v-col cols="12" v-if="detail.client && detail.client.name ? true : false">
                            <b> {{ $t('client')}}: </b>
                            <router-link class="text-primary" :to="{ name: 'client.profile', params: {'id' : detail.client.id}}" target="_blank">
                                {{ detail.client.name }}
                            </router-link>
                        </v-col>
                        <v-col cols="12"><b> {{ $t('sender')}}: </b>{{ detail.admin && detail.admin.name ? detail.admin.name :  $t('no_data')  }}</v-col>
                    </v-row>
                    <v-divider class="my-4"></v-divider>
                </v-card-text>
            </v-card>
        </v-dialog>
        </v-form>

    </v-container>
</template>
<script>

import {mapGetters} from "vuex"
import {ValidationObserver, ValidationProvider} from 'vee-validate'


export default {
    name: "Invites",
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            fab: false,
            email: null,
            email_search: null,
            invites: [],
            inviteItems: [],
            sortBy: "id",
            sortDir: false,
            page: 1,
            pageCount: 0,
            perPage: 5,
            totalVisiblePag: 5,
            totalInvites: 0,
            options: {},
            detail: {},
            loading: false,
            loadingDetail: false,
            headers: [
                {
                    text: this.$t('email'),
                    align: "left",
                    sortable: true,
                    value: "email"
                },
                {
                    text: this.$t('sent_date'),
                    sortable: true,
                    align: "center",
                    value: "sent_date"
                },
                {
                    text: this.$t('accepted'),
                    align: "center",
                    sortable: false,
                    value: "accepted",
                    width: 110,
                },
                {
                    text: this.$t('actions'),
                    align: "center",
                    value: 'action',
                    sortable: false,
                    width: 120,
                },
            ],
            dialogAdd: false,
            dialogDetails: false,

        };
    },
    computed: {
        ...mapGetters(['lang', 'itemsPerPage', 'perPageItems']),
        filteredHeaders() {
            return this.headers.filter(h => !h.hide)
        },
    },
    mounted() {
        this.options.itemsPerPage = this.perPage = this.itemsPerPage
    },
    watch: {
        options: {
            handler() {
                this.getInvites()
            },
            deep: false
        }
    },
    methods: {
        closeDialogAdd() {
            this.email = null
            this.dialogAdd = false;
        },
        cancelDetails(){
            this.dialogDetails = false;
        },
        async detailsInvite(item) {
            this.loadingDetail = true;
            this.dialogDetails = true;

            await this.$http
                .get("admin/invite/"+item.id)
                .then(res => {
                    this.detail = res.body.data
                    this.dialogDetails = true;
                })
                .catch(err => {
                    this.orderItems = []
                    this.$toastr.error(this.$t('failed_to_get_list_orders'))
                })
                .finally(end => {
                    this.loadingDetail = false
                })

        },


        editInvite(item) {
            this.$router.push({
                name: 'invite.profile',
                params: {
                    id: item.id
                }
            })
        },
        async deleteInvite(item) {
            if (confirm(this.$t('delete_invite'))) {
                var _this = this
                this.loading = true;
                await this.$http
                    .delete(`admin/invite/${item.id}`)
                    .then(res => {
                        this.$toastr.success(this.$t('invite_has_been_deleted'))
                        this.getInvites()
                    })
                    .catch(err => {
                        this.$toastr.error(this.$t('invite_has_not_been_deleted'))
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
                        this.loading = false
                    })
            }
        },
        async getInvites(type) {
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
            if (page !== undefined) {
                if (type === 'search') {
                    params.page = 1
                } else {
                    params.page = page
                }
            }
            if (itemsPerPage !== undefined) {
                params.perPage = itemsPerPage;
            }
            if (this.email_search) {
                params.email = this.email_search;
            }
            await this.$http
                .get("admin/invite", {
                    params: params,
                })
                .then(res => {
                    this.invites = res.body.data
                    this.page = res.body.meta.current_page
                    this.totalInvites = res.body.meta.total
                    this.pageCount = res.body.meta.last_page
                })
                .catch(err => {
                    this.invites = []
                    this.totalInvites = 0
                    this.$toastr.error(this.$t('failed_to_get_list_invites'))
                })
                .finally(end => {
                    this.loading = false
                })
        },
        async sentInvite() {
            var _this = this;
            this.progress = 0
            this.loading = true
            var formData = new FormData()

            if (this.email) {
                formData.append('email', this.email)
            }

            // Add
            await this.$http
                .post('admin/invite', formData, {
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
                    this.$toastr.success(this.$t('invite_has_been_added'))
                    this.dialogAdd = false
                    this.email = null
                    this.getInvites();
                })
                .catch(err => {
                    this.$toastr.error(this.$t('invite_has_not_been_added'))
                    this.dialogFileError = true
                    this.textFileError = err.body.message;

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
    }
}
</script>
