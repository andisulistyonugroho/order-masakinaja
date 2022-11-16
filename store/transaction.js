export const state = () => ({
  all: []
})

export const actions = {
  getTransaction ({ commit, rootState }, data) {
    this._vm.$nuxt.$emit('WAIT_DIALOG', true)
    const whereFilter = {
      isActive: true,
      customerId: rootState.user.profile.meAsCustomer.id
    }
    if (data.state === 'unpaid') {
      whereFilter.status = 1
    } else if (data.state === 'inprocess') {
      whereFilter.status = { inq: [2, 3] }
    } else if (data.status >= 0) { // jika hanya di cek if (data.status) thok, sistem menganggap status batal (0) sebagai false
      whereFilter.status = data.status
    }

    if (data.dateRange) {
      whereFilter.createdAt = { between: [data.dateRange[0], data.dateRange[1]] }
    }
    if (data.search) {
      whereFilter.orderItems = { productSet: { name: { like: `%${data.search}%` } } }
    }

    this.$axios.get('/Orders', {
      params: {
        filter: {
          where: whereFilter,
          include: [
            { orderItems: 'productSet' },
            'invoices'
          ]
        }
      }
    }).then((response) => {
      commit('setAll', response.data)
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
    }).catch((error) => {
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    })
  }
}

export const mutations = {
  setAll (state, data) {
    state.all = data
  }
}
