<template>
    <v-container fluid fill-height class="d-flex justify-center align-center">
        <v-card flat outlined>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" class="d-flex justify-center align-sm-center">
                        <div>
                            <div class="display-2 font-weight-bold">{{ $t('oops') }}</div>
                            <p class="title">{{ $t('access_to_the_page_is_denied') }}</p>
                            <p class="body-2">{{ $t('you_do_not_have_permission_to_go_to_this_page') }}</p>
                            <v-btn :to="{name: 'main'}">{{ $t('main_page') }}</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
                        <v-img src="/img/error_pages/403.gif" max-height="300" contain></v-img>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script>
export default {
    name: "Forbidden"
}
</script>
