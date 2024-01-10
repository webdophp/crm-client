process.env.VUE_APP_VERSION = require("./package.json").version

module.exports = {
    chainWebpack: config => {
        config.plugin("html")
            .tap(args => {
                args[0].title = process.env.VUE_APP_NAME;
                return args;
            })
        if (process.env.NODE_ENV === "production") {
            // mutate config for production...
        } else {
            // mutate for development...
        }
    },
    configureWebpack: {
        plugins: [
//            new VuetifyLoaderPlugin()
        ],
    },
    pluginOptions: {
        i18n: {
            locale: "ru",
            fallbackLocale: "ru",
            localeDir: "locales",
            enableInSFC: false
        }
    },
    transpileDependencies: [
        "vuetify"
    ],
    /*
    css: {
        loaderOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`
            }
        }
    },
    */
    devServer: {
        open: process.platform === "darwin",
        //https: {
        //    key: fs.readFileSync("../../../Configs/SSL/localhost.key"),
        //    cert: fs.readFileSync("../../../Configs/SSL/localhost.crt"),
        //},
        //public: "https://localhost:8080/",
        overlay: {
            warnings: true,
            errors: true
        }
    },
    lintOnSave: process.env.NODE_ENV !== "production",
    pwa: {
        dir: "auto",
        //lang: "ru-RU",
        serviceWorker: true,
        name: process.env.VUE_APP_NAME,
        shortName: process.env.VUE_APP_TITLE,
        description: process.env.VUE_APP_DESCRIPTION,
        version: process.env.VUE_APP_VERSION,
        gcm_sender_id: 406570611493,
        themeColor: "#ffffff",
        msTileColor: "#000000",
        appleMobileWebAppCapable: "yes",
        prefer_related_applications: false,
        orientation: "any",
        appleMobileWebAppStatusBarStyle: "#f5f7f7",
        manifestOptions: {
            dir: "auto",
            //lang: "ru-RU",
            name: process.env.VUE_APP_NAME,
            short_name: process.env.VUE_APP_TITLE,
            description: process.env.VUE_APP_DESCRIPTION,
            orientation: "any",
            start_url: '/topic',
            display: 'fullscreen',
            theme_color: "#ffffff",
            background_color: "#ffffff",
            appleMobileWebAppCapable: "yes",
            prefer_related_applications: false,
            appleMobileWebAppStatusBarStyle: "#f5f7f7",
            icons: [
                {
                    src: "./img/icons/windows11/SmallTile.scale-100.png",
                    sizes: "71x71",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SmallTile.scale-125.png",
                    sizes: "89x89",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SmallTile.scale-150.png",
                    sizes: "107x107",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SmallTile.scale-200.png",
                    sizes: "142x142",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SmallTile.scale-400.png",
                    sizes: "284x284",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square150x150Logo.scale-100.png",
                    sizes: "150x150",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square150x150Logo.scale-125.png",
                    sizes: "188x188",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square150x150Logo.scale-150.png",
                    sizes: "225x225",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square150x150Logo.scale-200.png",
                    sizes: "300x300",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square150x150Logo.scale-400.png",
                    sizes: "600x600",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Wide310x150Logo.scale-100.png",
                    sizes: "310x150",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Wide310x150Logo.scale-125.png",
                    sizes: "388x188",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Wide310x150Logo.scale-150.png",
                    sizes: "465x225",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Wide310x150Logo.scale-200.png",
                    sizes: "620x300",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Wide310x150Logo.scale-400.png",
                    sizes: "1240x600",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/LargeTile.scale-100.png",
                    sizes: "310x310",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/LargeTile.scale-125.png",
                    sizes: "388x388",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/LargeTile.scale-150.png",
                    sizes: "465x465",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/LargeTile.scale-200.png",
                    sizes: "620x620",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/LargeTile.scale-400.png",
                    sizes: "1240x1240",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.scale-100.png",
                    sizes: "44x44",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.scale-125.png",
                    sizes: "55x55",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.scale-150.png",
                    sizes: "66x66",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.scale-200.png",
                    sizes: "88x88",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.scale-400.png",
                    sizes: "176x176",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/StoreLogo.scale-100.png",
                    sizes: "50x50",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/StoreLogo.scale-125.png",
                    sizes: "63x63",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/StoreLogo.scale-150.png",
                    sizes: "75x75",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/StoreLogo.scale-200.png",
                    sizes: "100x100",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/StoreLogo.scale-400.png",
                    sizes: "200x200",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SplashScreen.scale-100.png",
                    sizes: "620x300",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SplashScreen.scale-125.png",
                    sizes: "775x375",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SplashScreen.scale-150.png",
                    sizes: "930x450",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SplashScreen.scale-200.png",
                    sizes: "1240x600",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/SplashScreen.scale-400.png",
                    sizes: "2480x1200",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-16.png",
                    sizes: "16x16",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-20.png",
                    sizes: "20x20",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-24.png",
                    sizes: "24x24",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-30.png",
                    sizes: "30x30",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-32.png",
                    sizes: "32x32",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-36.png",
                    sizes: "36x36",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-40.png",
                    sizes: "40x40",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-44.png",
                    sizes: "44x44",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-48.png",
                    sizes: "48x48",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-60.png",
                    sizes: "60x60",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-64.png",
                    sizes: "64x64",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-72.png",
                    sizes: "72x72",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-80.png",
                    sizes: "80x80",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-96.png",
                    sizes: "96x96",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.targetsize-256.png",
                    sizes: "256x256",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
                    sizes: "16x16",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
                    sizes: "20x20",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
                    sizes: "24x24",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
                    sizes: "30x30",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
                    sizes: "32x32",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
                    sizes: "36x36",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
                    sizes: "40x40",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
                    sizes: "44x44",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
                    sizes: "48x48",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
                    sizes: "60x60",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
                    sizes: "64x64",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
                    sizes: "72x72",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
                    sizes: "80x80",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
                    sizes: "96x96",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
                    sizes: "256x256",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
                    sizes: "16x16",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
                    sizes: "20x20",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
                    sizes: "24x24",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
                    sizes: "30x30",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
                    sizes: "32x32",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
                    sizes: "36x36",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
                    sizes: "40x40",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
                    sizes: "44x44",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
                    sizes: "48x48",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
                    sizes: "60x60",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
                    sizes: "64x64",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
                    sizes: "72x72",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
                    sizes: "80x80",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
                    sizes: "96x96",
                    type:"image/png"
                },
                {
                    src: "./img/icons/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
                    sizes: "256x256",
                    type:"image/png"
                },
                {
                    src: "./img/icons/android/android-launchericon-512-512.png",
                    sizes: "512x512",
                    type:"image/png"
                },
                {
                    src: "./img/icons/android/android-launchericon-192-192.png",
                    sizes: "192x192",
                    type:"image/png"
                },
                {
                    src: "./img/icons/android/android-launchericon-144-144.png",
                    sizes: "144x144",
                    type:"image/png"
                },
                {
                    src: "./img/icons/android/android-launchericon-96-96.png",
                    sizes: "96x96",
                    type:"image/png"
                },
                {
                    src: "./img/icons/android/android-launchericon-72-72.png",
                    sizes: "72x72",
                    type:"image/png"
                },
                {
                    src: "./img/icons/android/android-launchericon-48-48.png",
                    sizes: "48x48",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/16.png",
                    sizes: "16x16",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/20.png",
                    sizes: "20x20",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/29.png",
                    sizes: "29x29",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/32.png",
                    sizes: "32x32",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/40.png",
                    sizes: "40x40",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/50.png",
                    sizes: "50x50",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/57.png",
                    sizes: "57x57",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/58.png",
                    sizes: "58x58",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/60.png",
                    sizes: "60x60",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/64.png",
                    sizes: "64x64",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/72.png",
                    sizes: "72x72",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/76.png",
                    sizes: "76x76",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/80.png",
                    sizes: "80x80",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/87.png",
                    sizes: "87x87",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/100.png",
                    sizes: "100x100",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/114.png",
                    sizes: "114x114",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/120.png",
                    sizes: "120x120",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/128.png",
                    sizes: "128x128",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/144.png",
                    sizes: "144x144",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/152.png",
                    sizes: "152x152",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/167.png",
                    sizes: "167x167",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/180.png",
                    sizes: "180x180",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/192.png",
                    sizes: "192x192",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/256.png",
                    sizes: "256x256",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/512.png",
                    sizes: "512x512",
                    type:"image/png"
                },
                {
                    src: "./img/icons/ios/1024.png",
                    sizes: "1024x1024"
                }
            ]
        },

        //iconPaths: {
        //    favicon32: 'img/icons/favicon-32x32.png',
        //    favicon16: 'img/icons/favicon-16x16.png',
        //    appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
        //    maskIcon: 'img/icons/safari-pinned-tab.svg',
        //    msTileImage: 'img/icons/msapplication-icon-144x144.png'
        //}
        // configure the workbox plugin
        //workboxPluginMode: "InjectManifest",
        //workboxOptions: {
        // swSrc is required in InjectManifest mode.
        //    swSrc: "dev/sw.js",
        // ...other Workbox options...
        //}
    }
}