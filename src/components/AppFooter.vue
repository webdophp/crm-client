<template>
    <v-footer inset absolute app>
        {{ $t('footer_text', {year: $moment().format('YYYY')}) }} {{ appName }}
    </v-footer>
</template>
<script>
export default {
    name: "app-footer",
    data() {
        return {
            appName: null,
        }
    },
    mounted() {
        this.appName = process.env.VUE_APP_COMPANY_NAME
    }
}
</script>
