export default function ({ app, redirect }) {
  app.$axios.onRequest((config) => {
    config.headers.Authorization = app.store.state.user.token
  })

  app.$axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      // if the 401 coming from reset password form, do not check for token
      const url = error.response.config.url
      const checkFor =
        error.response.config.baseURL + '/Users/reset-password?accesstoken='
      if (url.includes(checkFor) === false) {
        app.$axios.post('/Users/tokenThere').then((response) => {
          if (response.data.result === false) {
            app.store.dispatch('user/removeDeadToken')
            setTimeout(function () {
              redirect('/login')
            }, 3000)
          }
        })
      }
    }
  })
}
