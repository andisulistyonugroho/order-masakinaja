// payment status
// 1: unpaid
// 2: verifying
// 3: paid
// 4: refund
// 0: canceled
export const state = () => ({
  paymentByStatus: []
})

export const actions = {
  async createPayment ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('payments')
        .insert([input])
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async cancelPayment ({ commit, dispatch }, paymentId) {
    try {
      const data = await dispatch('updatePaymentStatus', { paymentId, status: 0 })
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async updatePaymentStatus ({ commit }, input) {
    try {
      const setUpdate = { status: input.status }
      console.log('STATUS:', input.status)
      if (input.status === 2) {
        setUpdate.paid_at = new Date()
      } else if (input.status === 3) {
        setUpdate.admin_confirmed_at = new Date()
        console.log('tiga')
      }
      console.log('setupdate:', setUpdate)
      const { data, error } = await this.$supabase
        .from('payments')
        .update(setUpdate)
        .eq('id', input.paymentId)
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getPaymentByStatus ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('payments')
        .select(`*,
        orders(*)`)
        .eq('status', input.status)
      if (error) { throw error }

      commit('setPaymentByStatus', data)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const mutations = {
  setPaymentByStatus (state, data) {
    state.paymentByStatus = data
  }
}
