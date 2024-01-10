<template >
    <v-container class="mx-0 px-0">
        <v-row v-if="this.$route.name !== 'topic.messages'" >
            <v-col
                cols="12"
                class="user_position"
                md="10"
                lg="12"
            >

                <v-list class="my-0 py-0 mx-0 px-0 background_color_transparent" >
                    <v-list-item color="primary" class="mx-0 px-0">
                        <v-list-item-subtitle class="user-name" v-text="userName"></v-list-item-subtitle>
                        <v-list-item-avatar size="23" class="border1 ml-2">
                            <img v-if="userAvatar !== '/img/avatar.png'" :src="userAvatar" :alt="userName">
                            <v-icon v-else class="font-primary" size="16">
                                ${{'settingsIcon'}}
                            </v-icon>
                        </v-list-item-avatar>
                    </v-list-item>


                </v-list>
                <div class="user_language">RUS</div>

            </v-col>
        </v-row>
    </v-container>
</template>
<script>

import {mapGetters} from "vuex"

export default {
    name: "AppTopMenu",
    inject: [
        'forceRerender',
        'setUserData'
    ],
    props: {
        drawer: Boolean,
    },
    data() {
        return {
            company_name: null,
            user_name: null,
        }
    },
    mounted() {
        this.company_name = this.userCompany
        this.user_name = this.userName
    },
    computed: {
        ...mapGetters(['lang', 'userCompany','userName', 'userAvatar']),
    }
}
</script>

<style>
.user-name{
    color: #007EC9 !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    line-height: 21px !important;
    letter-spacing: 0 !important;
    text-align: right !important;

}

.user_position{
    position: absolute;
    right: 22px;
    top: 1px;
}


</style>
