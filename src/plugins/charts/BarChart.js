import { Bar } from 'vue-chartjs'

export default {
    extends: Bar,
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
        chartdata(val) {
            //this.$data._chart.update()
            //this.$data._chart.destroy()
            this.renderChart(this.chartdata, this.options)
        },
    },
    mounted() {
        this.renderChart(this.chartdata, this.options);
    }
}
