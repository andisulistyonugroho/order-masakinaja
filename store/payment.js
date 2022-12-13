export const state = () => ({
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
      const { data, error } = await this.$supabase
        .from('payments')
        .update({ status: input.status })
        .eq('id', input.paymentId)
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const mutations = {
}
