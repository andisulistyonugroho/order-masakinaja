export const state = () => ({
  all: []
})

export const actions = {
  async getAll ({ commit }) {
    try {
      const { data, error } = await this.$supabase
        .from('cooked_menus')
        .select()
        .eq('is_active', true)
      if (error) { throw error }

      commit('setAll', data)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async addCookedMeal ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('cooked_menus')
        .insert([input])
      if (error) { throw error }

      commit('updateAll', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const mutations = {
  setAll (state, data) {
    state.all = data
  },
  updateAll (state, data) {
    const current = state.all
    current.push(data[0])
    state.all = current
  }
}
