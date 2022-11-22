export const state = () => ({
  menu: {},
  orders: [],
  orderInDate: []
})

export const actions = {
  async addOrder ({ commit }, arrayInput) {
    try {
      const { data, error } = await this.$supabase
        .from('orders')
        .insert(arrayInput)
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getMenuByDate ({ commit }, today) {
    try {
      const { data, error } = await this.$supabase
        .from('daily_menu')
        .select(`
          *,
          cooked_menus(
            name, details
          )
        `)
        .eq('menu_date', today)
      if (error) { throw error }

      commit('setMenu', data[0])

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getOrderInRange ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('orders')
        .select(`
          *,
          childrens(
            call_name
          )
        `)
        .eq('is_active', true)
        .gte('order_date', input.start_date)
        .lte('order_date', input.end_date)
      if (error) { throw error }

      commit('setOrder', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getOrderInDate ({ commit }, date) {
    try {
      const { data, error } = await this.$supabase
        .from('orders')
        .select(`
          *,
          childrens(
            call_name
          )
        `)
        .eq('order_date', date)
        .eq('is_active', true)
      if (error) { throw error }

      commit('setOrderInDate', data)

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async updateOrder ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('orders')
        .update(input)
        .eq('id', input.id)
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export const mutations = {
  setMenu (state, data) {
    state.menu = data
  },
  setOrder (state, data) {
    state.orders = data
  },
  setOrderInDate (state, data) {
    state.orderInDate = data
  }
}
