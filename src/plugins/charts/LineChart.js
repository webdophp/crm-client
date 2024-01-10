import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: {
        chartdata: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: null
        }
    },
    watch: {
        chartdata() {
            //this.$data._chart.update()
            //this.$data._chart.destroy()
            this.renderChart(this.chartdata, this.options)
        },
    },
    mounted() {
        this.renderChart(this.chartdata, this.options);
    }
}
