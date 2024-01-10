<template>
    <v-container >
        <v-dialog v-model="dialogImage" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="cancelImage()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('add_edit_avatar') }}</v-toolbar-title>
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
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="9" v-if="!!objectUrl">
                            <v-row>
                                <v-col cols="12" class="d-flex justify-center">
                                    <div :style="'width: '+windowSize.width+'px; height: '+windowSize.height+'px;'">
                                        <img ref="sourceImage" :src="objectUrl"/>
                                    </div>
                                </v-col>
                                <v-col cols="12">
                                    <div class="d-flex justify-center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" icon @click="resetCropper" :title="$t('format_reset')">
                                                    <v-icon>mdi-aspect-ratio</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('format_reset') }}</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" icon @click="rotateLeft"
                                                       :title="$t('rotate_by_45_to_left')">
                                                    <v-icon>mdi-rotate-left</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('rotate_by_45_to_left') }}</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                                <v-btn v-on="on" icon @click="rotateRight"
                                                       :title="$t('rotate_by_45_to_right')">
                                                    <v-icon>mdi-rotate-right</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('rotate_by_45_to_right') }}</span>
                                        </v-tooltip>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="3" v-if="previewCropped && objectUrl">
                            <v-row>
                                <v-col cols="6" sm="12" class="d-flex justify-center justify-sm-start">
                                    <v-avatar tile color="white" size="100" class="border">
                                        <img class="image-preview px-3 py-3" :src="previewCropped"/>
                                    </v-avatar>
                                </v-col>
                                <v-col cols="6" sm="12" class="d-flex justify-center justify-sm-start">
                                    <v-avatar color="white" size="100" class="border">
                                        <img class="image-preview px-3 py-3" :src="previewCropped"/>
                                    </v-avatar>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-card elevation="0" class="profile_background_color">
            <v-row>
                <v-col cols="12" class="profile_background_color px-0 py-0" >
                    <v-container class="rounded-lg px-0 mx-0 py-0 my-0 text-center" style="border: solid 2px #007EC9" >
                        <v-img class="rounded-lg" v-if="imageSrc" :src="imageSrc" contain></v-img>
                        <v-icon color="#E4E4E4" size="50" style="min-height: 196px" v-if="!imageSrc">${{'settingsIcon'}}</v-icon>
                    </v-container>
                </v-col>
                <v-col cols="12" class="profile_background_color py-0 px-0 mx-0">
                    <v-container class="d-flex flex-row justify-start pa-0" justify="space-between center">
                        <v-container v-if="!imageSrc" class="px-0 mx-0 pt-3 pb-0 text-left">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click.stop="addImage()">
                                        <v-icon>${{'editIcon'}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('add') }}</span>
                            </v-tooltip>
                        </v-container>
                        <v-container v-if="imageSrc" class="px-0 mx-0 pt-3 pb-0 text-left">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click.stop="editImage()" class="mr-2">
                                        <v-icon>${{'editIcon'}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('edit') }}</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click="removeImage()">
                                        <v-icon>${{'deleteIcon'}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('delete') }}</span>
                            </v-tooltip>
                        </v-container>
                    </v-container>
                </v-col>


                <v-col cols="1" v-if="false" class="my-0 py-0 px-0 mx-0 pt-0 d-flex flex-col align-start align-self-end">
                    <v-container class="my-0 py-0 px-0 mx-0" >
                        <v-container v-if="imageSrc" class="px-0 mx-0 py-0 my-0 text-left">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click.stop="editImage()">
                                        <v-icon color="primary">${{'editIcon'}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('edit') }}</span>
                            </v-tooltip>
                        </v-container>
                        <v-container v-if="!imageSrc" class="px-0 mx-0 pt-0 pb-1 text-left">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click.stop="addImage()">
                                        <v-icon>mdi-image-plus</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('add') }}</span>
                            </v-tooltip>
                        </v-container>
                        <v-container v-if="imageSrc" class="px-0 mx-0 pt-0 pb-1 text-left">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" icon @click="removeImage()">
                                        <v-icon color="primary">${{'deleteIcon'}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ $t('delete') }}</span>
                            </v-tooltip>
                        </v-container>
                    </v-container>
                </v-col>
            </v-row>
            <v-row  v-if="false">
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
import {debounce, find, head} from 'lodash'

export default {
    name: "MakeAvatar",
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
            default: 1
        },
        viewMode: {
            type: [String, Number],
            default: 1
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            debouncedUpdatePreview: debounce(this.updatePreview, 257),
            edit: false,
            dialogImage: false,
            cropper: null,
            objectUrl: null,
            imageSrc: null,
            imageFile: null,
            previewCropped: null,
            widthAvatar: 150,
            heightAvatar: 150,
            windowSize: {
                width: 0,
                height: 0,
            },
            debug: false,
        };
    },
    mounted() {
        this.imageSrc = this.value ? this.value : null;
    },
    computed: {
        ...mapGetters(['defaultAvatar', 'lang']),
    },
    watch: {
        value(val) {
            if (val !== this.imageSrc) {
                this.imageSrc = val
            }
        },
    },
    methods: {
        onResize() {
            let p = this.$vuetify.breakpoint.xsOnly ? 90 : 60
            let w = window.innerWidth
            let h = window.innerHeight
            this.windowSize = {
                width: ((w / 100) * p),
                height: ((h / 100) * p)
            }
            if (this.$vuetify.breakpoint.xsOnly) {
                this.windowSize.height = (w >= h) ? this.windowSize.width : (this.windowSize.height / (16 / 9))
            } else {
                this.windowSize.height = (w >= h) ? this.windowSize.height : (this.windowSize.width / (16 / 9))
            }
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
                crop: this.debouncedUpdatePreview,
            })
        },
        updatePreview() {
            const canvas = this.cropper.getCroppedCanvas({
                fillColor: '#fff',
                width: this.widthAvatar,
                height: this.heightAvatar
            })
            if (this.imageFile !== null && this.imageFile.type) {
                this.previewCropped = canvas.toDataURL(this.imageFile.type);
            } else {
                let mimeType = this.getMimeType(this.$refs.sourceImage.src);
                if (mimeType) {
                    this.previewCropped = canvas.toDataURL(mimeType);
                }
            }
        },
        addImage: function () {
            this.edit = false
            this.dialogImage = true
        },
        editImage() {
            this.edit = true
            this.imageFile = null
            let imageSrc = this.imageSrc
            if (this.cropper) {
                this.cropper.destroy()
            }
            if (this.objectUrl) {
                window.URL.revokeObjectURL(this.objectUrl)
            }
            if (!imageSrc) {
                this.cropper = null
                this.objectUrl = null
                this.previewCropped = null
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
                width: this.widthAvatar,
                height: this.heightAvatar
            });
            if (this.imageFile !== null && this.imageFile.type) {
                this.imageSrc = canvas.toDataURL(this.imageFile.type);
            } else {
                let mimeType = this.getMimeType(this.$refs.sourceImage.src);
                if (mimeType) {
                    this.imageSrc = canvas.toDataURL(mimeType);
                }
            }
            this.edit = false
            this.cropper = null
            this.objectUrl = null
            this.imageFile = null
            this.dialogImage = false
            this.updateValue(this.imageSrc)
        },
        cancelImage() {
            this.edit = false
            this.cropper = null
            this.objectUrl = null
            this.imageFile = null
            this.dialogImage = false
        },
        updateValue(value) {
            this.$emit('input', value)
        }
    },
};

</script>
<style lang="scss">
</style>
