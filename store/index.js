import Vuex from 'vuex'

export default () => {
  return new Vuex.Store({
    state: {
      locale: 'en',
      available_locales: ['en', 'ja'],
      what: 'hello',
      translations: {},
      eth_address: null,
      user: null,
      authorization: null,
      accepted_terms_on: null
    },
    actions: {
      async nuxtServerInit ({state, dispatch}, {req}) {
        if (req.cookies.accepted_terms_on) state.accepted_terms_on = req.cookies.accepted_terms_on
        let locale = (req.cookies.locale || req.headers['accept-language'] || 'en').substr(0, 2)
        if (!state.available_locales.includes(locale)) locale = 'en'
        await dispatch('setLocale', {locale})
        await dispatch('setAuthorization', 'Bearer ' + req.cookies.authorization)
      },

      async authorize_with_password({dispatch}, data) {
        // TODO: use different way of get an authorization string instead of just posting email address
        let authorizationToken = await this.$axios.$post('/authorization', data, {withCredentials: true})
        await dispatch('setAuthorization', 'Bearer ' + authorizationToken)
      },

      async authorize_with_telegram() {
        let bot_id = process.env.TELEGRAM_BOT_ID
        let scope = ['email'] // require nothing... #['personal_details']
        let public_key = process.env.TELEGRAM_PUBLIC_KEY
        let payload = '123'
        Telegram.Passport.auth({bot_id, scope, public_key, payload})
      },

      async authorize_with_web3({state, dispatch}) {
        web3.personal.sign(web3.fromUtf8('shitcoin hub'), state.eth_address, async (err, signature) => {
          let authorizationToken = await this.$axios.$post('/authorization', {signature}, {withCredentials: true})
          dispatch('setAuthorization', 'Bearer ' + authorizationToken)
        })
      },

      async acceptTerms({state}) {
        state.accepted_terms_on = new Date().toUTCString()
        document.cookie = "accepted_terms_on="+new Date().toUTCString()
      },

      async setLocale({state, dispatch}, {locale}) {
        state.locale = locale
        if (process.env.VUE_ENV == 'client') document.cookie = "locale=" + locale
        state.translations = await this.$axios.$get('/locales/' + locale)
      },

      async logout({state, dispatch}) {
        await this.$axios.$delete('/authorization', {withCredentials: true})
        await dispatch('setAuthorization', null)
      },

      async setAuthorization({state, dispatch}, authorization) {
        state.authorization = authorization
        this.$axios.setToken(authorization)
        
        if (authorization) {
          state.user = await this.$axios.$get('/me')
        }
        else {
          state.user = null
        }
      }
    }
  })
}
  