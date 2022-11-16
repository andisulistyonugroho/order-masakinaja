export const state = () => ({
  id: null,
  token: null,
  profile: null,
  role: null,
  userIdVerification: null,
  email: null,
  orderState: [
    { text: 'Belum dibayar', value: 1 },
    { text: 'Menunggu Konfirmasi', value: 2 },
    { text: 'Terbayar', value: 3 },
    { text: 'Terkirim', value: 4 },
    { text: 'Batal', value: 0 }
  ],
  banks: []
})

export const actions = {
  async loginAct ({ commit, dispatch }, payload) {
    try {
      const { data: lData } = await this.$axios.post('/Users/login', {
        username: `cust:${payload.username}`,
        password: payload.password
      })
      const authData = { ...lData }
      await commit('setAuthData', authData)
      await dispatch('getUserRole', authData.userId)
      await dispatch('getMyProfile', authData.userId)
      return Promise.resolve(authData)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async doLogout ({ commit, dispatch }) {
    try {
      await this.$axios.post('/Users/logout')
      commit('menu/reset', null, { root: true })
      commit('doLogout')
    } catch (error) {
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    }
  },
  removeDeadToken ({ commit, dispatch }) {
    commit('doLogout')
  },
  async getMyProfile ({ commit, dispatch }, userId) {
    try {
      const { data } = await this.$axios
        .get('/UserProfiles/findOne', {
          params: {
            filter: {
              where: { userId },
              include: [
                {
                  relation: 'users',
                  scope: {
                    fields: ['username', 'email']
                  }
                },
                { meAsCustomer: { shippingAddresses: ['Province', 'City', 'District'] } }
              ]
            }
          }
        })
      commit('setProfile', data)
    } catch (error) {
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    }
  },
  getProfileByUserId ({ commit, dispatch }, userId) {
    this.$axios
      .get('/user_profiles/findOne', {
        params: {
          filter: {
            where: { userId },
            include: {
              relation: 'user',
              scope: {
                fields: ['username']
              }
            }
          }
        }
      })
      .then((response) => {
        commit('setProfile', response.data)
      })
      .catch((error) => {
        this._vm.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      })
  },
  setProfileAva ({ commit, dispatch }, data) {
    this.$axios
      .patch(`/UserProfiles/${data.profileId}`, {
        ava: data.ava
      })
      .then((response) => {
        this._vm.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'UPDATE PROFILE SUKSES'
        })
        dispatch('getProfileByUserId', data.profileId)
      })
      .catch((error) => {
        this._vm.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      })
  },
  getUserRole ({ commit }, userId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/Users/${userId}/role`)
        .then((response) => {
          commit('setRole', response.data)
          return resolve(true)
        })
        .catch((error) => {
          this._vm.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'error',
            message: error
          })
          return reject(error)
        })
    })
  },
  async getBanks ({ commit }) {
    const { data } = await this.$axios.get('/Banks', {
      params: {
        filter: {
          where: { isActive: true }
        }
      }
    })
    commit('setBanks', data)
  },
  async registerCustomer ({ commit }, payload) {
    try {
      const { data: lData } = await this.$axios.post('/Users/registerCustomer', {
        username: payload.username,
        fullname: payload.name,
        email: payload.email,
        mobile: payload.wa,
        birthdate: payload.birthDate,
        referrer: payload.referrer.id
      })
      const authData = { ...lData }
      return Promise.resolve(authData)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async verifyOtp ({ commit, state }, payload) {
    try {
      const { data: lData } = await this.$axios.post('/Users/confirmToken', {
        mobile: payload.mobile,
        token: payload.token
      })
      if (!lData.valid) {
        throw new Error('Kombinasi kode verifikasi & WA salah')
      }
      return Promise.resolve(lData)
    } catch (error) {
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
      return Promise.reject(error)
    }
  }
}

export const mutations = {
  setAuthData (state, authData) {
    state.id = authData.userId
    state.token = authData.id
    state.username = authData.username
    this.$axios.setToken(state.token)
  },
  doLogout (state) {
    state.id = null
    state.token = null
    state.profile = null
    state.role = null
    this.$axios.setToken(false)
  },
  setProfile (state, data) {
    state.profile = data
  },
  setRole (state, data) {
    state.role = data
  },
  setUserIdVerification (state, data) {
    state.userIdVerification = data.id
    state.email = data.email
  },
  setUserIdVerificationToNull (state) {
    state.userIdVerification = null
    state.email = null
  },
  setBanks (state, data) {
    state.banks = data
  }
}
