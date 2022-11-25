export const state = () => ({
  menu: {},
  orders: [],
  orderInDate: [],
  sumOrders: [],
  invoices: []
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
            *
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
  async countOrderInRange ({ commit }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('orders')
        .select('id, order_date')
        .eq('is_active', true)
        .gte('order_date', input.start_date)
        .lte('order_date', input.end_date)
      if (error) { throw error }

      const tmp = []
      for (const n of data) {
        const index = tmp.findIndex(obj => obj.order_date === n.order_date)
        if (index >= 0) {
          tmp[index].count += 1
        } else {
          tmp.push({
            order_date: n.order_date,
            count: 1
          })
        }
      }
      commit('setSumOrders', tmp)

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
  },
  async getOrderByStatus ({ commit }, input) {
    try {
      let query = this.$supabase
        .from('orders')
        .select('*,childrens(*),cooked_menus(name)')

      if (input.status === 'paid') {
        query = query.in('status', [2, 3])
      } else if (input.status === 'unpaid') {
        query = query.eq('status', 1)
          .eq('is_active', true)
      }
      const { data, error } = await query
      if (error) { throw error }

      commit('setInvoices', data)

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
  },
  setSumOrders (state, data) {
    state.sumOrders = data
  },
  setInvoices (state, data) {
    state.invoices = data
  }
}
