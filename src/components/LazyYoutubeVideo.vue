<template>
    <div :class="(!isVideoLoaded ? 'mt-5 ' : '') + 'y-video'" @click="clickHandler">
        <div class="y-video__inner" :style="styleObj">
            <template v-if="!isVideoLoaded">
                <v-img :src="`https://i.ytimg.com/vi/${videoId}/${previewImageSize}.jpg`"
                       :contain="contain"></v-img>
                <button v-if="showBtn" type="button" class="y-video__button" :aria-label="buttonLabel">
                    <svg viewBox="0 0 68 48" version="1.1" width="100%" height="100%">
                        <path
                            class="y-video__button-shape"
                            d="M66.5 7.7c-.8-2.9-2.5-5.4-5.4-6.2C55.8.1 34 0 34 0S12.2.1 6.9 1.6c-3 .7-4.6 3.2-5.4 6.1a89.6 89.6 0 0 0 0 32.5c.8 3 2.5 5.5 5.4 6.3C12.2 47.9 34 48 34 48s21.8-.1 27.1-1.6c3-.7 4.6-3.2 5.4-6.1C68 35 68 24 68 24s0-11-1.5-16.3z"
                        ></path>
                        <path class="y-video__button-icon" d="M45 24L27 14v20"></path>
                    </svg>
                </button>
            </template>
            <iframe v-else :src="generateURL()" allowfullscreen allow="autoplay" class="y-video__media"></iframe>
        </div>
    </div>
</template>

<script>
export default {
    name: "lazy-youtube-video",
    props: {
        videoId: {
            type: String,
            required: true,
        },
        contain: {
            type: Boolean,
            default: false
        },
        buttonLabel: {
            type: String,
            default: "Play video"
        },
        aspectRatio: {
            type: String,
            default: "16:9",
            validator: value => {
                const pattern = /^\d+:\d+$/
                return pattern.test(value)
            }
        },
        previewImageSize: {
            type: String,
            default: "maxresdefault",
            validator: value =>
                [
                    "default",
                    "mqdefault",
                    "sddefault",
                    "hqdefault",
                    "maxresdefault"
                ].indexOf(value) !== -1
        }
    },
    data() {
        return {
            isVideoLoaded: false,
            showBtn: false
        }
    },
    computed: {
        styleObj() {
            return {
                //paddingBottom: this.getPaddingBottom()
            }
        }
    },
    mounted(){
        const open = () => {
            setTimeout(() => {
                this.showBtn = true
            }, 10)
        }
        setTimeout(open, 500)
    },
    methods: {
        generateURL() {
            const query = "?rel=0&showinfo=0&autoplay=1"
            return `https://www.youtube.com/embed/${this.videoId}${query}`
        },
        clickHandler() {
            const open = () => {
                setTimeout(() => {
                    this.isVideoLoaded = true
                }, 10)
            }
            setTimeout(open, 300)
            this.$emit("videoLoaded")
        },
        getPaddingBottom() {
            const [a, b] = this.aspectRatio.split(":")
            return `${(b / a) * 100}%`
        }
    }
}
</script>
