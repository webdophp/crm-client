<template>
    <v-container>
        <v-col
            v-if="($vuetify.breakpoint.lgOnly)"
            style="position:fixed;bottom: 80px;transform: translate(-15.6%, 50%);"

        >
            <v-img src="/img/logo.svg" width="88px"></v-img>
        </v-col >
        <v-col style="position:fixed;bottom: 50px; right:30px">
            <v-btn
                @click="dialog_add_topic = true"
                large
                color="#f45d44"
                dark
                absolute
                top
                right
                fab
                id="v-step-2"
            >
                <v-icon>mdi-comment-text-outline mdi-24px mdi-flip-h</v-icon>
            </v-btn>
        </v-col>

        <ValidationObserver ref="observer" v-slot="{ invalid, validated, passes, validate }">
            <v-dialog v-model="dialog_add_topic"
                      transition="dialog-bottom-transition"
                      :max-width="!$vuetify.breakpoint.xsOnly ? 600 : '100%'"
                      overlay-color = "#edebeb"
                      :content-class="!$vuetify.breakpoint.xsOnly ? 'rounded-lg border1_B3B3B3' : ''"

                      :fullscreen="$vuetify.breakpoint.xsOnly"
                      :hide-overlay="$vuetify.breakpoint.xsOnly"
                      :scrollable="$vuetify.breakpoint.xsOnly"
            >
                <v-card>
                    <v-card-title>{{$t('create_request')}}</v-card-title>
                    <v-card-text>
                        <ValidationProvider ref="topic" rules="required|min:10|max:1000"
                                            v-slot="{ errors, valid }">
                            <v-textarea
                               solo
                               :label="$t('describe_it_in_as_much_detail_possible')"
                               auto-grow
                               outlined
                               rows="8"
                               row-height="25"
                               v-model="topic"
                               :error-messages="errors"
                               :disabled="loading"
                            >
                           </v-textarea>
                        </ValidationProvider>
                    </v-card-text>

                    <v-card-actions class="justify-end">
                        <v-btn
                            text
                            @click="dialog_add_topic = false"
                        >{{$t('close')}}</v-btn>
                        <v-progress-linear  v-model="progress"
                                            :active="loading" class="mr-2"></v-progress-linear>
                        <v-btn
                            text
                            :disabled="invalid || loading"
                            :loading="loading"
                            @click="addTopic"
                        >
                            {{ $t('create') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </ValidationObserver>
    </v-container>
</template>
<script>

import {mapGetters} from "vuex"
import {ValidationObserver, ValidationProvider} from "vee-validate";


export default {
    name: "AppButtonAddTopic",
    inject: [
        'forceRerender',
        'setUserData'
    ],
    props: {
        drawer: Boolean,
    },
    components: {
        ValidationProvider,
        ValidationObserver
    },
    data() {
        return {
            progress: 0,
            dialog_add_topic: false,
            topic: null,
            loading: false,
        }
    },
    computed: {
        ...mapGetters(['lang']),
    },
    methods:{
        async addTopic() {
            var _this = this;
            this.progress = 0
            this.loading = true
            var formData = new FormData()
            if (this.languages && this.languages[this.tab]) {
                formData.append('language', this.languages[this.tab])
            }
            if (this.topic) {
                formData.append('topic', this.topic)
            }
              // Add
            await this.$http
                .post('client/topic', formData, {
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
                    this.$toastr.success(this.$t('topic_has_been_added'));
                    if (res && res.body && res.body.data && res.body.data.uuid) {
                        this.exist_translations = res.body.data.exist_translations
                        this.all_translations = res.body.data.all_translations
                        this.$router.push({
                            name: 'topic.messages',
                            params: {
                                uuid: res.body.data.uuid
                            }
                        })
                    }
                    /*
                    else {
                        this.$router.push({
                            name: 'company'
                        })
                    }
                    */
                })
                .catch(err => {
                    this.$toastr.error(this.$t('topic_has_not_been_added'));
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
    }

}
</script>


