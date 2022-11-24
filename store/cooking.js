export const state = () => ({
  all: [],
  menuInRange: []
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
  },
  async getMenuInRange ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('daily_menu')
        .select(`
          *,
          cooked_menus(
            *
          )
        `)
        .gte('menu_date', input.start_date)
        .lte('menu_date', input.end_date)
      if (error) { throw error }

      commit('setMenuInRange', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async updateDailyMenu ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('daily_menu')
        .update({
          cooked_menu_id: input.cooked_menu_id
        })
        .eq('id', input.id)
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async addDailyMenu ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('daily_menu')
        .insert([{
          menu_date: input.menu_date,
          cooked_menu_id: input.cooked_menu_id
        }])
      if (error) { throw error }

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
  },
  setMenuInRange (state, data) {
    state.menuInRange = data
  }
}
