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
  }
}

export const mutations = {
}
