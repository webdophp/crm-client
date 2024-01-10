<template>
    <div>
        <v-dialog v-if="displayDateTimePicker" v-model="displayDateTimePicker"
                  :width="dialogWidth" content-class="date-time-picker" class="py-0">
            <v-card>
                <v-card-text class="px-0 py-0">
                    <v-tabs v-model="activeTab" fixed-tabs>
                        <v-tab key="calendar">
                            <slot name="dateIcon">
                                <v-icon>mdi-calendar</v-icon>
                            </slot>
                        </v-tab>
                        <v-tab key="timer" :disabled="dateSelected">
                            <slot name="timeIcon">
                                <v-icon>mdi-clock-outline</v-icon>
                            </slot>
                        </v-tab>
                        <v-tab-item key="calendar">
                            <v-date-picker ref="date" v-model="date" v-bind="datePickerProps"
                                           :locale="locale" :min="minDate" :max="maxDate"
                                           @input="showTimePicker(true)"
                                           first-day-of-week="1" full-width>
                            </v-date-picker>
                        </v-tab-item>
                        <v-tab-item key="timer">
                            <v-time-picker ref="timer" v-model="time" v-bind="timePickerProps"
                                           :locale="locale" :format="format" :min="minTime" :max="maxTime"
                                           :use-seconds="useSeconds" @change="okHandlerAfter"
                                           @click:minute="okHandlerAfterPicker" full-width>
                            </v-time-picker>
                        </v-tab-item>
                    </v-tabs>
                </v-card-text>
                <v-card-actions v-if="!closeAfterSelection">
                    <v-spacer></v-spacer>
                    <slot name="actions" :parent="this">
                        <v-btn color="grey lighten-1" text @click.native="clearHandler">
                            {{ clearText }}
                        </v-btn>
                        <v-btn color="primary" text @click="okHandler">
                            {{ okText }}
                        </v-btn>
                    </slot>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ValidationProvider ref="ageToProvider" :rules="validatorRules"
                            v-slot="{ errors, valid }">
            <v-text-field v-bind="textFieldProps" :disabled="disabled" :error="!valid"
                          :loading="loading" :append-icon="appendIcon"  :label="label"
                          :value="formattedDatetime" :error-messages="errors" :locale="locale"
                          :color="color" :readonly="readonly" :clearable="clearable"
                          @click.stop="displayDateTimePicker = !displayDateTimePicker"
                          :prepend-icon="prependIcon" @click:clear="clearHandler">
                <template v-slot:progress>
                    <slot name="progress">
                        <v-progress-linear color="primary" indeterminate absolute height="2"></v-progress-linear>
                    </slot>
                </template>
            </v-text-field>
        </ValidationProvider>
    </div>
</template>
<script>

import {ValidationProvider} from 'vee-validate'

export default {
    name: 'datetime-picker',
    components: {
        ValidationProvider,
    },
    model: {
        prop: 'datetime',
        event: 'input'
    },
    props: {
        datetime: {
            type: [Date, String],
            default: null
        },
        disabled: {
            type: [Boolean, String],
            default: false
        },
        loading: {
            type: [Boolean, String],
            default: false
        },
        label: {
            type: String,
            default: ''
        },
        dialogWidth: {
            type: [Number, String],
            default: 290
        },
        dateFormat: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        timeFormat: {
            type: String,
            default: 'HH:mm:ss'
        },
        format: {
            type: String,
            default: 'ampm'
        },
        prependIcon: {
            type: String,
            default: undefined
        },
        appendIcon: {
            type: String,
            default: undefined
        },
        maxDateTime: {
            type: String,
            default: undefined
        },
        minDateTime: {
            type: String,
            default: undefined
        },
        clearText: {
            type: String,
            default: 'CLEAR'
        },
        okText: {
            type: String,
            default: 'OK'
        },
        validatorRules: {
            type: String,
            default: 'date_time_format_hm'
        },
        validatorName: {
            type: String,
            default: null
        },
        textFieldProps: {
            type: Object
        },
        datePickerProps: {
            type: Object
        },
        timePickerProps: {
            type: Object
        },
        closeAfterSelection: {
            type: Boolean,
            default: true
        },
        readonly: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        useSeconds: {
            type: Boolean,
            default: false
        },
        fullWidth: {
            type: Boolean,
            default: false
        },
        color: {
            type: String,
            default: 'primary'
        },
        locale: {
            type: String,
            default: 'en'
        },
        timezone: {
            type: String,
            default: 'utc'
        },
        errorMessages: {
            type: [Boolean, String, Array, Object],
            default: null
        }
    },
    data() {
        return {
            displayDateTimePicker: false,
            activeTab: 0,
            date: null,
            time: null,
            minDate: null,
            maxDate: null,
            minTime: null,
            maxTime: null,
        }
    },
    computed: {
        dateTimeFormat() {
            return this.dateFormat + ' ' + this.timeFormat
        },
        formattedDatetime() {
            //return this.selectedDatetime ? this.$moment.tz(this.selectedDatetime, this.timezone).format(this.dateTimeFormat) : ''
            return this.selectedDatetime ? this.$moment(this.selectedDatetime).format(this.dateTimeFormat) : ''
        },
        selectedDatetime() {
            if (this.date && this.time) {
                let datetimeString = this.date + ' ' + this.time
                //return this.$moment.tz(datetimeString, this.timezone).format(this.dateTimeFormat)
                return this.$moment(datetimeString).format(this.dateTimeFormat)
            } else {
                return null
            }
        },
        dateSelected() {
            return !this.date
        }
    },
    watch: {
        datetime: function (val) {
            this.init()
        },
        maxDateTime: function (nval, oval) {
            if (nval && nval !== oval) {
                //this.init()
                this.maxDate = this.$moment(this.maxDateTime).format(this.dateFormat)
            }
        },
        minDateTime: function (nval, oval) {
            if (nval && nval !== oval) {
                //this.init()
                this.minDate = this.$moment(nval).format(this.dateFormat)
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            if (this.minDateTime) {
                this.minDate = this.$moment(this.minDateTime).format(this.dateFormat)
                if (!this.maxDateTime) {
                    this.maxDate = null
                }
            }
            if (this.maxDateTime) {
                if (!this.minDateTime) {
                    this.minDate = null
                }
                this.maxDate = this.$moment(this.maxDateTime).format(this.dateFormat)
            }
            if (!this.datetime) {
                return
            }
            let initDateTime
            if (this.datetime instanceof Date) {
                initDateTime = this.datetime
            } else if (typeof this.datetime === 'string' || this.datetime instanceof String) {
                initDateTime = this.$moment(this.datetime).format(this.dateTimeFormat)
            }
            this.date = this.$moment(initDateTime).format(this.dateFormat)
            this.time = this.$moment(initDateTime).format(this.timeFormat)

            this.$nextTick(() => {
                this.showTimePicker(false)
            })

        },
        okHandler() {
            this.resetPicker()
            this.$emit('input', this.selectedDatetime)
        },
        okHandlerAfter() {
            this.resetPicker()
            this.$emit('input', this.selectedDatetime)
        },
        okHandlerAfterPicker() {
            if (this.closeAfterSelection) {
                this.resetPicker()
                this.$emit('input', this.selectedDatetime)
            }
        },
        clearHandler() {
            this.resetPicker()
            this.date = null
            this.time = null
            this.$emit('input', null)
        },
        resetPicker() {
            this.displayDateTimePicker = false
            this.activeTab = 0
            if (this.$refs.timer) {
                this.$refs.timer.selectingHour = true
            }
        },
        showTimePicker(activeTab) {
            this.minTime = null
            this.maxTime = null
            if (this.minDateTime) {
                if (this.$moment(this.date).format(this.dateFormat) <= this.$moment(this.minDateTime).format(this.dateFormat)) {
                    this.minTime = this.$moment(this.minDateTime).format(this.timeFormat)
                }
            }
            if (this.maxDateTime) {
                if (this.$moment(this.date).format(this.dateFormat) >= this.$moment(this.maxDateTime).format(this.dateFormat)) {
                    this.maxTime = this.$moment(this.maxDateTime).format(this.timeFormat)
                }
            }
            if (activeTab) {
                this.activeTab = 1
            }
        }
    }
}
</script>
<style>
.date-time-picker .v-picker__title {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
}

.date-time-picker .v-slide-group__prev.v-slide-group__prev--disabled {
    display: none !important;
}
</style>
