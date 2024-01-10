<template>
    <v-main>
        <transition name="fade" mode="out-in">
            <v-container fluid fill-height justify-center align-center
                         class="max_width ">
                <v-col cols="12" class="logo_login">
                    <v-img src="/img/logo.svg" :width="$vuetify.breakpoint.xsOnly ? '70px' : '88px'"></v-img>
                </v-col>
                <v-row justify="center" class="pb-0 mobi_margin_logo">
                    <v-col cols="12" :md="($route.name==='register' || $route.name ==='clientRegister') ? 3 : 4" xl="4"></v-col>
                    <v-col cols="12" :md="($route.name==='register' || $route.name ==='clientRegister') ? 6 : 4" xl="4" class="pb-0"
                           :class="$vuetify.breakpoint.xsOnly ? 'mx-1' : ''"
                           :style="($route.name==='register' || $route.name ==='clientRegister') ? '': 'max-width: 500px'" >
                        <div>
                            <router-view></router-view>
                        </div>
                        <div v-if="$route.name==='login' && $vuetify.breakpoint.xsOnly" class="pt-5 register_div">
                            {{ $t('recover_password')}}
                            <router-link :to="{ name: 'forgot'}" class="text-decoration-none" >
                                {{ $t('restore')}}
                            </router-link>
                        </div>
                        <div v-if="($route.name==='forgot' || $route.name==='reset_password') && $vuetify.breakpoint.xsOnly" class="pt-5 register_div">
                            {{ $t('remember_your_password') }}
                            <router-link :to="{ name: 'login'}" class="text-decoration-none" >
                                {{ $t('enter') }}
                            </router-link>
                        </div>
                        <div v-if="$route.name==='register' && $vuetify.breakpoint.xsOnly" class="pt-5 register_div">
                            {{ $t('do_you_already_have_an_account') }}
                            <router-link :to="{ name: 'login'}" class="text-decoration-none" >
                                {{ $t('enter') }}
                            </router-link>
                        </div>
                    </v-col>
                    <v-col cols="12" :md="($route.name==='register' || $route.name ==='clientRegister') ? 3 : 4" xl="4"></v-col>
                </v-row>
                <div v-if="$route.name==='login' && !$vuetify.breakpoint.xsOnly" class="mt-5 register_div">
                    {{ $t('recover_password')}}
                    <router-link :to="{ name: 'forgot'}" class="text-decoration-none" >
                        {{ $t('restore')}}
                    </router-link>
                </div>
                <div v-if="($route.name==='forgot' || $route.name==='reset_password') && !$vuetify.breakpoint.xsOnly" class="mt-5 register_div">
                    {{ $t('remember_your_password') }}
                    <router-link :to="{ name: 'login'}" class="text-decoration-none" >
                        {{ $t('enter') }}
                    </router-link>
                </div>
                <div v-if="$route.name==='register' && !$vuetify.breakpoint.xsOnly" class="mt-5 register_div">
                    {{ $t('do_you_already_have_an_account') }}
                    <router-link :to="{ name: 'login'}" class="text-decoration-none" >
                        {{ $t('enter') }}
                    </router-link>
                </div>
            </v-container>
        </transition>
    </v-main>
</template>
<script>

export default {
    name: "single-page-layout",
    async mounted() {
        this.appName = process.env.VUE_APP_NAME
    }
}
</script>

