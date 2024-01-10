<template>
    <v-container class="px-0 py-0">
        <v-dialog v-model="dialogImage" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="cancelImage()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('add_edit_image') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark text @click="saveImage()">{{ $t('save') }}</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-row v-resize="onResize" align="center" justify="center">
                        <v-col v-if="!edit" cols="12">
                            <v-file-input v-if="!edit" v-model="imageFile" accept=".png,.jpg,.jpeg"
                                          :show-size="1024" @change="setupCropper" :label="$t('choose_image_file')"
                                          color="primary"></v-file-input>
                        </v-col>
                        <v-col cols="12" v-if="!!objectUrl">
                            <v-row>
                                <v-col cols="12" class="d-flex justify-center">
                                    <div :style="'width: '+windowSize.width+'px; height: '+windowSize.height+'px;'">
                                        <img ref="sourceImage" :src="objectUrl"/>
                                    </div>
                                </v-col>
                                <v-col v-if="showButtons" cols="12" class="d-flex justify-center">
                                    <v-row>
                                        <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn v-on="on" icon @click="setRatio(NaN)">
                                                        <v-icon>mdi-crop-free</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('format_free') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn v-on="on" icon @click="setRatio((16/9))">
                                                        <v-icon>mdi-crop-landscape</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('format_16_9') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn v-on="on" icon @click="setRatio((2/3))">
                                                        <v-icon>mdi-crop-portrait</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('format_2_3') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn v-on="on" icon @click="setRatio((1/1))">
                                                        <v-icon>mdi-crop-square</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('format_1_1') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-start">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn v-on="on" icon @click="resetCropper">
                                                        <v-icon>mdi-aspect-ratio</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('format_reset') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn v-on="on" icon @click="rotateLeft">
                                                        <v-icon>mdi-rotate-left</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('rotate_by_45_to_left') }}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <v-btn v-on="on" icon @click="rotateRight">
                                                        <v-icon>mdi-rotate-right</v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>{{ $t('rotate_by_45_to_right') }}</span>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-card outlined elevation="1">
            <v-row v-if="imageSrc || (!imageSrc && showDefault)" justify="center">
                <v-col cols="12" class="pb-0">
                    <v-container class="pa-2">
                        <v-img v-if="imageSrc" :src="imageSrc" contain></v-img>
                        <img v-if="imageSrc" ref="image" :src="imageSrc" style="display: none;">
                        <v-img v-if="!imageSrc || (!imageSrc && showDefault)" :src="defaultImage" contain></v-img>
                    </v-container>
                </v-col>
            </v-row>
            <v-row v-if="!readonly">
                <v-col cols="12" class="pt-0">
                    <v-container class="d-flex flex-row pa-0" justify="space-between center">
                        <v-container v-if="imageSrc" class="pt-0 pb-1 text-center">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click.stop="editImage()">
                                        <v-icon>mdi-image-edit</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('edit') }}</span>
                            </v-tooltip>
                        </v-container>
                        <v-container v-if="!imageSrc" class="pt-0 pb-1 text-center">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click.stop="addImage()">
                                        <v-icon>mdi-image-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('add') }}</span>
                            </v-tooltip>
                        </v-container>
                        <v-container v-if="imageSrc" class="pt-0 pb-1 text-center">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click="removeImage()">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('delete') }}</span>
                            </v-tooltip>
                        </v-container>
                    </v-container>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<script>

import {mapGetters} from "vuex"
import Cropper from 'cropperjs'

export default {
    name: "MakePhoto",
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: String,
            default: null,
        },
        aspectRatio: {
            type: [String, Number],
            default: (16 / 9)
        },
        viewMode: {
            type: [String, Number],
            default: 0
        },
        showDefault: {
            type: Boolean,
            default: true
        },
        showButtons: {
            type: Boolean,
            default: true
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            edit: false,
            dialogImage: false,
            cropper: null,
            objectUrl: null,
            imageSrc: null,
            imageFile: null,
            widthImage: 1280,
            heightImage: 720,
            windowSize: {
                width: 0,
                height: 0,
            },
        };
    },
    computed: {
        ...mapGetters(['defaultImage', 'lang'])
    },
    watch: {
        value(val) {
            this.imageSrc = val ? val : null
            if (val !== this.imageSrc) {
                this.imageSrc = val
            }
        },
    },
    mounted() {
        this.imageSrc = this.value ? this.value : null
    },
    methods: {
        onResize() {
            let p = this.$vuetify.breakpoint.xsOnly ? 80 : 70
            let w = window.innerWidth
            let h = window.innerHeight
            this.windowSize = {
                width: ((w / 100) * p),
                height: ((h / 100) * p)
            }
            this.windowSize.height = (w >= h) ? this.windowSize.height : (this.windowSize.width / (16 / 9))
        },
        resetCropper() {
            this.cropper.reset()
        },
        rotateLeft() {
            this.cropper.rotate(-45)
        },
        rotateRight() {
            this.cropper.rotate(45)
        },
        setRatio(val) {
            this.cropper.setAspectRatio(val)
        },
        setupCropper(imageFile) {
            if (this.cropper) {
                this.cropper.destroy()
            }
            if (this.objectUrl) {
                window.URL.revokeObjectURL(this.objectUrl)
            }
            if (!imageFile) {
                this.cropper = null
                this.objectUrl = null
                return
            }
            this.objectUrl = window.URL.createObjectURL(imageFile)
            this.$nextTick(this.setupCropperInstance)
        },
        setupCropperInstance() {
            this.cropper = new Cropper(this.$refs.sourceImage, {
                aspectRatio: Number(this.aspectRatio),
                viewMode: Number(this.viewMode),
                autoCropArea: 1,
                fillColor: '#FFFFFF',
            })
        },
        addImage: function () {
            this.edit = false
            this.dialogImage = true
        },
        editImage() {
            this.edit = true
            this.imageFile = null
            let imageSrc = this.imageSrc;
            if (this.cropper) {
                this.cropper.destroy()
            }
            if (this.objectUrl) {
                window.URL.revokeObjectURL(this.objectUrl)
            }
            if (!imageSrc) {
                this.cropper = null
                this.objectUrl = null
                return
            }
            this.objectUrl = imageSrc;
            this.$nextTick(this.setupCropperInstance)
            this.dialogImage = true
        },
        removeImage() {
            this.imageSrc = null;
            this.updateValue(this.imageSrc)
        },
        saveImage() {
            const canvas = this.cropper.getCroppedCanvas({
                fillColor: '#fff',
                width: this.widthImage
                //height: this.heightImage
            });
            if (this.imageFile !== null && this.imageFile.type) {
                this.imageSrc = canvas.toDataURL(this.imageFile.type, 0.9);
            } else {
                let mimeType = this.getMimeType(this.$refs.sourceImage.src);
                if (mimeType) {
                    this.imageSrc = canvas.toDataURL(mimeType);
                }
            }
            this.edit = false
            this.cropper = null;
            this.objectUrl = null;
            this.imageFile = null;
            this.dialogImage = false;
            this.updateValue(this.imageSrc)
        },
        cancelImage() {
            this.edit = false
            this.cropper = null;
            this.objectUrl = null;
            this.imageFile = null;
            this.dialogImage = false;
        },
        updateValue(value) {
            this.$emit('input', value)
        }
    }
};
</script>
<style lang="scss">
</style>
