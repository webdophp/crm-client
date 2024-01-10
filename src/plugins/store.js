import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      phoneMask: '+# (###) ###-##-##',
      defaultAvatar: "/img/avatar.png",
      defaultImage: "/img/no-image.png",
      defaultLogo: "/img/no-logo.png",
      userAvatar: "/img/avatar.png",
      userName: null,
      userCompany: null,
      userInitials: null,
      userPosition: null,
      itemsPerPage: 10,
      perPageItems: [5, 10, 25, 50, 100],
      listLanguages: ['ru'],
      listLanguageNames: [],
      showNotifyMessages: "unread",
      countUnreadNotifications: 0,
      lang: "ru",
      timezone: "Asia/Almaty",
      currency: "KZT",
      defaultCurrency: "KZT",
      isPbx: false,
      theme: null,
      funnelCustomer: 1,
      formAdministrator: {
          administrator: null,
          email: null,
          phone: null,
          active: null,
          page: null,
          perPage: null,
          sortBy: null,
          sortDir: null,
      },
  },
  mutations: {
      updatePhoneMask(state, phoneMask) {
          state.phoneMask = phoneMask
      },
      updateLanguage(state, language) {
          state.lang = language
      },
      updateListLanguages(state, listLanguages) {
          state.listLanguages = listLanguages
      },
      updateListLanguageNames(state, listLanguageNames) {
          state.listLanguageNames = listLanguageNames
      },
      updateTimezone(state, timezone) {
          state.timezone = timezone
      },
      updateDefaultAvatar(state, defaultAvatar) {
          state.defaultAvatar = defaultAvatar
      },
      updateDefaultImage(state, defaultImage) {
          state.defaultImage = defaultImage
      },
      updateDefaultLogo(state, defaultLogo) {
          state.defaultLogo = defaultLogo
      },
      updateDefaultCurrency(state, defaultCurrency) {
          state.defaultCurrency = defaultCurrency
      },
      updateCurrency(state, currency) {
          state.currency = currency
      },
      updateItemsPerPage(state, itemsPerPage) {
          state.itemsPerPage = itemsPerPage
      },
      updatePerPageItems(state, perPageItems) {
          state.perPageItems = perPageItems
      },
      updateIsPbx(state, isPbx) {
          state.isPbx = isPbx
      },
      updateShowNotifyMessages(state, showNotifyMessages) {
          state.showNotifyMessages = showNotifyMessages
      },
      updateUserAvatar(state, avatar) {
          state.userAvatar = avatar
      },
      updateUserName(state, name) {
          state.userName = name
      },
      updateUserInitials(state, name) {
          state.userInitials = name.firstLetterCaps()
      },
      updateUserCompany(state, company) {
          state.userCompany = company
      },
      updateUserPosition(state, position) {
          state.userPosition = position
      },
      updateFormAdministrator(state, data) {
          state.formAdministrator = data
      },
      updateTheme(state, theme) {
          state.theme = theme
      },
      updateCountUnreadNotifications(state, countUnreadNotifications) {
          state.countUnreadNotifications = countUnreadNotifications
      }
  },
  actions: {
      setSettings({commit}, user) {

          if (user && user.userCompany) {
              commit('updateUserCompany', user.userCompany)
          }
          if (user && user.defaultAvatar) {
              commit('updateDefaultAvatar', user.defaultAvatar)
          }
          if (user && user.defaultImage) {
              commit('updateDefaultImage', user.defaultImage)
          }
          if (user && user.defaultLogo) {
              commit('updateDefaultLogo', user.defaultLogo)
          }
          if (user && user.defaultCurrency) {
              commit('updateDefaultCurrency', user.defaultCurrency)
              commit('updateCurrency', user.currency)
          }
          if (user && user.itemsPerPage) {
              commit('updateItemsPerPage', user.itemsPerPage)
          }
          if (user && user.perPageItems) {
              commit('updatePerPageItems', user.perPageItems)
          }
          if (user && user.language) {
              commit('updateLanguage', user.language)
          }
          if (user && user.listLanguages) {
              commit('updateListLanguages', user.listLanguages)
          }
          if (user && user.listLanguageNames) {
              commit('updateListLanguageNames', user.listLanguageNames)
          }
          if (user && user.timezone) {
              commit('updateTimezone', user.timezone)
          }
          if (user && user.isPbx) {
              commit('updateIsPbx', user.isPbx)
          }
          if (user && user.showNotifyMessages) {
              commit('updateShowNotifyMessages', user.showNotifyMessages)
          }
          if (user && user.theme) {
              commit('updateTheme', user.theme)
          }
      },
      setLanguage({commit}, language) {
          commit('updateLanguage', language)
      },
      setCurrency({commit}, currency) {
          commit('updateCurrency', currency)
      },
      setUserAvatar({commit}, avatar) {
          commit('updateUserAvatar', avatar)
      },
      setUserName({commit}, name) {
          commit('updateUserName', name)
      },

      setUserInitials({commit}, name) {
          commit('updateUserInitials', name)
      },
      setUserPosition({commit}, position) {
          commit('updateUserPosition', position)
      },
      setFormAdministrator({commit}, data) {
          commit('updateFormAdministrator', data)
      },
      setCountUnreadNotifications({commit}, data) {
          commit('updateCountUnreadNotifications', data)
      }
  },
  getters: {
    phoneMask: state => state.phoneMask,
    lang: state => state.lang,
    language: state => state.lang,
    listLanguages: state => state.listLanguages,
    listLanguageNames: state => state.listLanguageNames,
    showNotifyMessages: state => state.showNotifyMessages,
    timezone: state => state.timezone,
    defaultAvatar: state => state.defaultAvatar,
    defaultImage: state => state.defaultImage,
    defaultLogo: state => state.defaultLogo,
    defaultCurrency: state => state.defaultCurrency,
    currency: state => state.currency,
    itemsPerPage: state => state.itemsPerPage,
    perPageItems: state => state.perPageItems,
    funnelCustomer: state => state.funnelCustomer,
    userAvatar: state => state.userAvatar,
    userName: state => state.userName,
    userCompany: state => state.userCompany,
    userInitials: state => state.userInitials,
    userPosition: state => state.userPosition,
    formAdministrator: state => state.formAdministrator,
    theme: state => state.theme,
    countUnreadNotifications: state => state.countUnreadNotifications,
},
  modules: {}
});
