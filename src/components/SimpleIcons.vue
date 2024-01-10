<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        :class="'v-icon notranslate v-icon--svg theme--' + theme"
        :style="'font-size: ' + width + 'px; width: ' + width + 'px; height: ' + height + 'px;'"
    >
        <path :d="path"/>
        <g :fill="iconColor">
            <slot/>
        </g>
    </svg>
</template>

<script>
    import SimpleIcons from 'simple-icons'

    export default {
        name: "simple-icons",
        props: {
            name: {
                type: String,
            },
            theme: {
                type: String,
                default: 'light'
            },
            width: {
                type: [Number, String],
                default: 20
            },
            height: {
                type: [Number, String],
                default: 20
            },
            iconColor: {
                type: String,
                default: 'currentColor'
            }
        },
        computed: {
            path: function () {
                return SimpleIcons.get(this.name).path;
            },
        }
    };
</script>

<style scoped>
</style>
