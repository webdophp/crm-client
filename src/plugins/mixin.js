export default {
    methods: {
        changePhone(phone) {
            return phone ? phone.replace(/ /g, "").replace(/-/g, "").replace("+", "").replace("(", "").replace(")", "") : null
        },
        mimeTypeImage(type){
            return (/\/(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(type)
        },
        getDate(date){
            if(this.$moment(date).format('DD.MM.YYYY') === this.$moment().format('DD.MM.YYYY')){
                return this.$t('today')
            }
            else if(this.$moment(date).format('DD.MM.YYYY') === this.$moment().subtract(1, 'd').format('DD.MM.YYYY')){
                return this.$t('yesterday')
            }
            else  {
                return this.$moment(date).format('DD.MM.YYYY')
            }
        },
        getMimeType(file) {
            if (file.length < 250) {
                const regExp = /.*\.(.+)$/
                let typeFile = regExp.exec(file)[1]
                if (typeFile && (typeFile === "jpg" || typeFile === "jpeg" || typeFile === "png" || typeFile === "svg")) {
                    if (typeFile === "jpg" || typeFile === "jpeg") {
                        return "image/jpeg";
                    } else if (typeFile === "svg") {
                        return "image/svg+xml";
                    } else {
                        return "image/png";
                    }
                }
            } else if (file.length > 250) {
                let arr = file.split(",")
                let mime = arr[0].match(/:(.*?);/)[1]
                if (mime && (mime === "image/jpeg" || mime === "image/png" || mime === "image/svg+xml")) {
                    return mime
                }
            }
            return null
        },
        getBase64FromImgURL(image) {
            let canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
            let mimeType = this.getMimeType(image.src);
            return canvas.toDataURL(mimeType);
        },
        dataURL64toBlob(url64) {
            var arr = url64.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([
                u8arr
            ], {
                type: mime
            })
        },
        async convertBlobToBase64(file) {
            return await new Promise((resolve, reject) => {
                var fr = new FileReader();
                fr.onloadend = () => {
                    resolve(fr.result)
                }
                fr.onerror = () => {
                    reject(fr.error)

                }
                fr.readAsDataURL(file);
            })
        },
        async getImageBlob(imageUrl) {
            const response = await fetch(imageUrl)
            return response.blob()
        },
        hasPermission(permission) {
            let permissions = []
            if (this.$auth.check() && this.$auth.user() && this.$auth.user().roles) {
                permissions = this.$auth.user().roles
            }
            if (permissions && permissions.length > 0 && typeof permissions === "object") {
                return permissions.some(item => item === permission)
            }
            return false;
        },
        can(permission, all = false) {
            if (typeof permission === "object") {
                for (var i = 0; i < permission.length; i++) {
                    if (all) {
                        if (!this.hasPermission(permission[i])) {
                            return false;
                        }
                    } else {
                        if (this.hasPermission(permission[i])) {
                            return true;
                        }
                    }
                }
                if (all && i === permission.length) {
                    return true;
                }
            } else if (typeof permission === "string") {
                return this.hasPermission(permission)
            }
        },
        tinymceInitDefault() {
            return {
                selector: "textarea",
                min_height: 200,
                height: 300,
                schema: "html5",
                //plugins: ["link", "autolink", "media", "code", "table", "autoresize", "image", "textcolor"],
                plugins: [
                    "advlist autolink autosave autoresize link image media lists charmap preview hr anchor",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking",
                    "table template paste importcss textpattern"
                ],
                menubar: false,
                toolbar: "fontsizeselect | undo redo | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | blockquote | table | bullist numlist | link image media youtube | removeformat code | fullscreen",
                //extended_valid_elements: "+iframe[src|width|height|name|align|class]",
                //toolbar: "insertfile fontsizeselect | undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | removeformat code | table tablecontrols bullist numlist | link image media",
                media_live_embeds: true,
                media_alt_source: true,
                media_dimensions: false,
                media_filter_html: false,
                //media_poster: false,
                media_url_resolver: function (data, resolve/*, reject*/) {
                    if (data.url.indexOf("https://www.youtube.com/embed") !== -1 || data.url.indexOf("https://www.youtube.com/watch") !== -1) {
                        var url = data.url
                        if (data.url.indexOf("https://www.youtube.com/watch") !== -1) {
                            url = url.replace(/\/watch\?v=/g, '/embed/')
                        }
                        var embedHtml = '<iframe src="' + url +
                            '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                        resolve({html: embedHtml})
                    } else {
                        resolve({html: ""})
                    }
                },
                video_template_callback: function (data) {
                    return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>';
                },
                audio_template_callback: function (data) {
                    return '<audio controls>' + '\n<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + '</audio>'
                },
                fontsize_formats: "8px 10px 11px 12px 14px 18px 24px 36px 38px 42px",
                language: this.lang,
                language_url: `/js/tinymce/langs/${this.lang}.js`,
                //content_css: "/js/tinymce/content.css",
                skin: (this.$vuetify.theme.dark ? 'oxide-dark' : 'oxide'),
                content_css: (this.$vuetify.theme.dark ? 'dark' : 'default'),
                //skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
                //content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default')

                /*
                images_upload_url: "postAcceptor.php",
                images_upload_base_path: "/some/basepath",
                automatic_uploads: true,
                */

                /*
                setup: function (editor) {
                    editor.on("keydown", function (e) {
                        if (event.which == 13) {
                            alert("enter pressed")
                            event.preventDefault()
                        }
                    })
                }
                */
            }
        },
        tinymceInitBlog() {
            return {
                selector: "textarea",
                min_height: 200,
                height: 300,
                schema: "html5",
                //plugins: ["link", "autolink", "media", "code", "table", "autoresize", "image", "textcolor"],
                plugins: [
                    "advlist autolink autosave autoresize link image media lists charmap preview hr anchor",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking",
                    "table template paste importcss textpattern"
                ],
                menubar: false,
                toolbar1: "fontsizeselect | undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify",
                toolbar2: "forecolor backcolor | blockquote | bullist numlist | table  | link image media youtube | removeformat code | fullscreen",

                //extended_valid_elements: "+iframe[src|width|height|name|align|class]",
                //toolbar: "insertfile fontsizeselect | undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | removeformat code | table tablecontrols bullist numlist | link image media",
                media_live_embeds: true,
                media_alt_source: true,
                media_dimensions: false,
                media_filter_html: false,
                //media_poster: false,
                media_url_resolver: function (data, resolve/*, reject*/) {
                    if (data.url.indexOf("https://www.youtube.com/embed") !== -1 || data.url.indexOf("https://www.youtube.com/watch") !== -1) {
                        var url = data.url
                        if (data.url.indexOf("https://www.youtube.com/watch") !== -1) {
                            url = url.replace(/\/watch\?v=/g, '/embed/')
                        }
                        var embedHtml = '<iframe src="' + url +
                            '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                        resolve({html: embedHtml})
                    } else {
                        resolve({html: ""})
                    }
                },
                video_template_callback: function (data) {
                    return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>'
                },
                audio_template_callback: function (data) {
                    return '<audio controls>' + '\n<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + '</audio>'
                },
                fontsize_formats: "8px 10px 11px 12px 14px 18px 24px 36px 38px 42px",
                language: this.lang,
                language_url: `/js/tinymce/langs/${this.lang}.js`,
                //content_css: "/js/tinymce/content.css",
                skin: (this.$vuetify.theme.dark ? 'oxide-dark' : 'oxide'),
                content_css: (this.$vuetify.theme.dark ? 'dark' : 'default'),
                //skin: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide'),
                //content_css: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default')

                /*
                images_upload_url: "postAcceptor.php",
                images_upload_base_path: "/some/basepath",
                automatic_uploads: true,
                */

                /*
                setup: function (editor) {
                    editor.on("keydown", function (e) {
                        if (event.which == 13) {
                            alert("enter pressed")
                            event.preventDefault()
                        }
                    })
                }
                */
            }
        },
    }
}
