<template>
    <v-container fluid fill-height class="d-flex justify-center align-center">
        <v-card flat outlined>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" class="d-flex justify-center align-sm-center">
                        <div>
                            <div class="display-2 font-weight-bold">{{ $t('oops') }}</div>
                            <p class="title">{{ $t('this_page_does_not_exist') }}</p>
                            <p class="body-2">{{ $t('please_check_if_the_url_is_correct') }}</p>
                            <v-btn :to="{name: 'main'}">{{ $t('main_page') }}</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
                        <v-img src="/img/error_pages/404.png" contain></v-img>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
export default {
    name: "NotFound"
}
</script>
