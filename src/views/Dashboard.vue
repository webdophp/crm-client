<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="px-0 mx-0 pb-0 font-weight-normal"
                   style="font-weight: 500"
            >
                Hey, Yevgeniy! 👑 <br/>
                You have 9 things to attend

            </v-col>
        </v-row>
        <v-card flat>
            <v-card-text>

                <v-row>
                    <v-col class="py-0" cols="12">
                        <v-card class="d-flex flex-wrap" flat tile>
                            <v-card v-for="(chart, i) in charts" :key="i"
                                    :min-width="$vuetify.breakpoint.smAndDown ? '98%' : '49%'"
                                    :max-width="$vuetify.breakpoint.smAndDown ? '98%' : '49%'"
                                    class="pa-1 ma-1 mx-auto text-center" elevation="3" outlined tile>
                                <bar-chart :chartdata="chart" :options="optionsChartBar"></bar-chart>
                            </v-card>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>

//import LineChart from '../plugins/charts/LineChart.js'
import BarChart from '../plugins/charts/BarChart.js'

export default {
    name: "Dashboard",
    components: {
        BarChart,
        //LineChart,
    },
    data() {
        return {
            charts: [],
            optionsChartLine: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            //stepSize: 1,
                            beginAtZero: true,
                            callback: function (value) {
                                if (value % 1 === 0) {
                                    return value;
                                }
                            }
                        }
                    }]
                },
            },
            optionsChartBar: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            //stepSize: 1,
                            beginAtZero: true,
                            callback: function (value) {
                                if (value % 1 === 0) {
                                    return value;
                                }
                            }
                        }
                    }]
                },
            },
        }
    },
    mounted() {
        this.getCountOrders()
    },
    methods: {
        getCountOrders() {
            this.$http
                .get('client/dashboard')
                .then(res => {
                    this.charts = res.body.data
                })
                .catch(err => {
                    this.charts = [];
                    this.$toastr.error(this.$t('failed_to_get_list_charts'))
                })
        }
    }
}
</script>
