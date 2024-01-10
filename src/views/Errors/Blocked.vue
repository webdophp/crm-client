<template>
    <v-container fluid fill-height class="d-flex justify-center align-center">
        <v-card flat outlined>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" class="d-flex justify-center align-sm-center">
                        <div>
                            <div class="display-2 font-weight-bold">{{ $t('oops') }}</div>
                            <p class="title">{{ $t('access_temporarily_blocked') }}</p>
                            <p class="body-2">{{ $t('please_try_again_later_we_apologize') }}</p>
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
    name: "Blocked"
}
</script>
