import "roboto-fontface/css/roboto/roboto-fontface.css"
import "cropperjs/dist/cropper.css"
import "element-ui/lib/theme-chalk/index.css";
import '@mdi/font/css/materialdesignicons.css'
import '../styles/custom.css'


import Vue from "vue";
import Vuetify from "vuetify/lib";

import en from 'vuetify/lib/locale/en'
import ru from 'vuetify/lib/locale/ru'
import kk from '../locales/vendor/vuetify/kk'


import HomeIcon from '../components/swg/HomeIcon.vue'
import MessagesIcon from '../components/swg/MessagesIcon.vue'
import TransactionsIcon from '../components/swg/TransactionsIcon.vue'
import AccountingsIcon from '../components/swg/AccountingsIcon.vue'
import InvoicesIcon from '../components/swg/InvoicesIcon.vue'
import ReportingIcon from '../components/swg/ReportingIcon.vue'
import CompanyIcon from '../components/swg/CompanyIcon.vue'
import StoragesIcon from '../components/swg/StoragesIcon.vue'
import SettingsIcon from '../components/swg/SettingsIcon.vue'
import DownIcon from '../components/swg/DownIcon.vue'
import BackIcon from '../components/swg/BackIcon.vue'
import TrackingIcon from '../components/swg/TrackingIcon.vue'
import NotificationsIcon from '../components/swg/NotificationsIcon.vue'
import LogoutIcon from '../components/swg/LogoutIcon.vue'
import NotificationIcon from '../components/swg/NotificationIcon.vue'
import LockOpenIcon from '../components/swg/LockOpenIcon.vue'
import LockIcon from '../components/swg/LockIcon.vue'
import FileDownloadIcon from '../components/swg/FileDownloadIcon.vue'
import DocumentIcon from '../components/swg/DocumentIcon.vue'
import EditIcon from '../components/swg/EditIcon.vue'
import DeleteIcon from '../components/swg/DeleteIcon.vue'
import AccountPlusIcon from '../components/swg/AccountPlusIcon.vue'
import CommentTextIcon from '../components/swg/CommentTextIcon.vue'
import PaperClipIcon from '../components/swg/PaperClipIcon.vue'
import AirCarriersIcon from '../components/swg/AirCarriersIcon.vue'
import RoadTransportIcon from '../components/swg/RoadTransportIcon.vue'
import RailwayTransportationIcon from '../components/swg/RailwayTransportationIcon.vue'
import SeaTransportationIcon from '../components/swg/SeaTransportationIcon.vue'
import DealIcon from '../components/swg/DealIcon.vue'
import EyeIcon from '../components/swg/EyeIcon.vue'
import EyeOffIcon from '../components/swg/EyeOffIcon.vue'
import EmailIcon from '../components/swg/EmailIcon.vue'
import ChevronRightIcon from '../components/swg/ChevronRightIcon.vue'
import CloseIcon from '../components/swg/CloseIcon.vue'
import TabCloseIcon from '../components/swg/TabCloseIcon.vue'

Vue.use(Vuetify);

export default new Vuetify({
    options: {
        customProperties: true,
    },
    /*
    breakpoint: {
        scrollBarWidth: 16,
        mobileBreakpoint: 'sm',
        thresholds: {
            xs: 0,
            sm: 470,
            md: 600,
            lg: 800,
            xl: 1280,
            xxl: 1920
        },
    },
    */
    theme: {
        themes: {
            light: {
                primary: '#007EC9',
                /*
                primary: '#1976D2',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
                */
            },
            dark: {
                primary: '#424242',
            },
        },
    },
    lang: {
        locales: {en, ru, kk},
        current: process.env.VUE_APP_I18N_LOCALE || process.env.VUE_APP_I18N_FALLBACK_LOCALE
    },
    icons: {
        iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4
        values: {
            homeIcon: {
                component: HomeIcon
            },
            messagesIcon:{
                component: MessagesIcon
            },
            transactionsIcon: {
                component: TransactionsIcon
            },
            accountingIcon: {
                component: AccountingsIcon
            },
            invoicesIcon: {
                component: InvoicesIcon
            },
            reportingIcon: {
                component: ReportingIcon
            },
            companyIcon: {
                component: CompanyIcon
            },
            settingsIcon: {
                component: SettingsIcon
            },
            downIcon: {
                component: DownIcon
            },
            backIcon: {
                component: BackIcon
            },
            TrackingIcon: {
                component: TrackingIcon
            },
            StoragesIcon: {
                component: StoragesIcon
            },
            NotificationsIcon: {
                component: NotificationsIcon
            },
            LogoutIcon: {
                component: LogoutIcon
            },
            notificationIcon: {
                component: NotificationIcon
            },
            lockOpenIcon: {
                component: LockOpenIcon
            },
            lockIcon: {
                component: LockIcon
            },
            fileDownloadIcon: {
                component: FileDownloadIcon
            },
            documentIcon: {
                component: DocumentIcon
            },
            editIcon: {
                component: EditIcon
            },
            deleteIcon: {
                component: DeleteIcon
            },
            accountPlusIcon: {
                component: AccountPlusIcon
            },
            commentTextIcon: {
                component: CommentTextIcon
            },
            paperClipIcon: {
                component: PaperClipIcon
            },
            airCarriersIcon: {
                component: AirCarriersIcon
            },
            roadTransportIcon: {
                component: RoadTransportIcon
            },
            railwayTransportationIcon: {
                component: RailwayTransportationIcon
            },
            seaTransportationIcon: {
                component: SeaTransportationIcon
            },
            dealIcon: {
                component: DealIcon
            },
            eyeIcon: {
                component: EyeIcon
            },
            eyeOffIcon: {
                component: EyeOffIcon
            },
            emailIcon: {
                component: EmailIcon
            },
            chevronRightIcon: {
                component: ChevronRightIcon
            },
            closeIcon: {
                component: CloseIcon
            },
            tabCloseIcon: {
                component: TabCloseIcon
            },





        }
    }
});
