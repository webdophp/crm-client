<template>
    <v-container fluid class="px-0 py-0">
        <v-dialog v-model="dialogImage" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="cancelImage(selectId)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('add_edit_image') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark text @click="saveImage(selectId)">{{ $t('save') }}</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-row v-resize="onResize" align="center" justify="center">
                        <v-col v-if="selectId===null" cols="12">
                            <v-file-input v-if="selectId===null" v-model="selectedImageFile"
                                          accept=".svg,.png,.jpg,.jpeg" :show-size="1024"
                                          @change="setupCropper" :label="$t('choose_image_file')"
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
        <draggable v-model="backgrounds" :forceFallback="true" draggable=".item"
                   handle=".handle" @change="updateValue(backgrounds)">
            <v-card v-for="(background, i) in backgrounds" :key="i" class="d-inline-block ma-1 item"
                    style="vertical-align: top;" outlined elevation="3" width="140" height="170">
                <v-container class="flex-column pa-0">
                    <v-container class="text-center pa-2 pb-0" style="width: 140px; height: 132px">
                        <v-img :src="background" class="handle align-center" width="140" height="132" contain></v-img>
                        <img ref="image" :src="background" style="display: none;">
                    </v-container>
                    <v-container class="text-center px-0 py-0">
                        <v-container class="d-flex flex-row px-0 py-0" justify="center">
                            <v-container class="px-0 py-0">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" icon @click.stop="editImage(i)">
                                            <v-icon>mdi-image-edit</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('edit') }}</span>
                                </v-tooltip>
                            </v-container>
                            <v-container class=" px-0 py-0">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" icon @click.stop="removeImage(i)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('delete') }}</span>
                                </v-tooltip>
                            </v-container>
                        </v-container>
                    </v-container>
                </v-container>
            </v-card>
            <v-card slot="footer" key="footer" class="d-inline-block mx-1 my-1"
                    style="vertical-align: top;" outlined elevation="3" width="140" height="170">
                <v-container class="fill-height py-0 justify-center">
                        <v-icon @click.stop="addImage">mdi-image-plus mdi-48px</v-icon>
                </v-container>
            </v-card>
        </draggable>
    </v-container>
</template>
<script>

import Cropper from 'cropperjs'
import draggable from 'vuedraggable'

export default {
    name: "MediaGallery",
    components: {
        draggable,
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: Array,
            required: false,
        },
        aspectRatio: {
            type: [String, Number],
            default: (16 / 9)
        },
        viewMode: {
            type: [String, Number],
            default: 0
        },
        showButtons: {
            type: Boolean,
            default: true
        },
        showFrames: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            dragging: false,
            dialogImage: false,
            cropper: null,
            widthImage: 1024,
            heightImage: 1024,
            objectUrl: null,
            selectedImageFile: null,
            selectId: null,
            imageUrl: null,
            backgrounds: [],
            windowSize: {
                width: 0,
                height: 0,
            },
        }
    },
    mounted() {
        this.backgrounds = this.value ? this.value : null
        //this.onResize()
    },
    watch: {
        value(val) {
            if (val !== this.backgrounds) {
                this.backgrounds = val
            }
        },
    },
    methods: {
        onResize() {
            let p = this.$vuetify.breakpoint.xsOnly ? 80 : 60
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
        setupCropper(selectedImageFile) {
            if (this.cropper) {
                this.cropper.destroy()
            }
            if (this.objectUrl) {
                window.URL.revokeObjectURL(this.objectUrl)
            }
            if (!selectedImageFile) {
                this.cropper = null
                this.objectUrl = null
                return
            }
            this.objectUrl = window.URL.createObjectURL(selectedImageFile)
            this.$nextTick(this.setupCropperInstance)
        },
        setupCropperInstance() {
            this.cropper = new Cropper(this.$refs.sourceImage, {
                aspectRatio: Number(this.aspectRatio),
                viewMode: Number(this.viewMode),
                autoCropArea: 1,
                fillColor: '#FFFFFF',
            })
            if (this.showFrames) {
                setTimeout(() => {
                    let container = document.querySelector(".cropper-crop-box")
                    container.insertAdjacentHTML('beforeend', '<span class="cropper-line cropper-line-bg line-e-1"></span>')
                    container.insertAdjacentHTML('beforeend', '<span class="cropper-line cropper-line-bg line-n-1"></span>')
                    container.insertAdjacentHTML('beforeend', '<span class="cropper-line cropper-line-bg line-w-1"></span>')
                    container.insertAdjacentHTML('beforeend', '<span class="cropper-line cropper-line-bg line-s-1"></span>')
                }, 300)
            }
        },
        addImage: function () {
            this.selectId = null
            this.dialogImage = true
        },
        editImage(i) {
            this.selectedImageFile = null
            this.selectId = i
            let imageUrl = this.backgrounds[i]
            if (this.cropper) {
                this.cropper.destroy()
            }
            if (this.objectUrl) {
                window.URL.revokeObjectURL(this.objectUrl)
            }
            if (!imageUrl) {
                this.cropper = null
                this.objectUrl = null
                return
            }
            this.objectUrl = imageUrl
            this.$nextTick(this.setupCropperInstance)
            this.dialogImage = true
        },
        removeImage(i) {
            this.backgrounds.splice(i, 1)
            this.updateValue(this.backgrounds)
        },
        saveImage(i) {
            const canvas = this.cropper.getCroppedCanvas({
                fillColor: '#fff',
                width: this.widthImage,
                height: this.heightImage
            })
            if (i === null && this.selectedImageFile.type) {
                let url = canvas.toDataURL(this.selectedImageFile.type, 0.9)
                this.backgrounds.push(url)
                this.selectedImageFile = null
            } else {
                let mimeType = this.getMimeType(this.$refs.sourceImage.src)
                if (mimeType) {
                    this.backgrounds[i] = canvas.toDataURL(mimeType)
                }
            }
            this.cropper = null
            this.objectUrl = null
            this.selectedImageFile = null
            this.selectId = null
            this.dialogImage = false
            this.updateValue(this.backgrounds)
        },
        cancelImage(i) {
            this.cropper = null
            this.objectUrl = null
            this.selectedImageFile = null
            this.selectId = null
            this.dialogImage = false
        },
        updateValue(value) {
            this.$emit('input', value)
        }
    }
}
</script>
