export const state = () => ({
  series: [],
  productSets: [],
  paymentBanks: []
})

export const actions = {
  getSeries ({ commit }) {
    this._vm.$nuxt.$emit('WAIT_DIALOG', true)
    this.$axios.get('/ProductSeries', {
      params: {
        filter: {
          where: { isActive: true }
        }
      }
    }).then((response) => {
      commit('setSeries', response.data)
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
    }).catch((error) => {
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    })
  },
  getProductSets ({ commit }, data) {
    this._vm.$nuxt.$emit('WAIT_DIALOG', true)
    this.$axios.get('/ProductSets', {
      params: {
        filter: {
          where: { isActive: true, productSeriesId: data.productSeriesId }
        }
      }
    }).then((response) => {
      commit('setProductSets', response.data)
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
    }).catch((error) => {
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    })
  },
  getPaymentBanks ({ commit }) {
    this.$axios.get('/PaymentBanks', {
      params: {
        filter: {
          where: { isActive: true },
          include: 'bank'
        }
      }
    }).then((response) => {
      commit('setPaymentBanks', response.data)
    }).catch((error) => {
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    })
  }
}

export const mutations = {
  setSeries (state, data) {
    state.series = data
  },
  setProductSets (state, data) {
    state.productSets = data
  },
  setPaymentBanks (state, data) {
    state.paymentBanks = data
  }
}
