export const state = () => ({
  mine: []
})

export const actions = {
  async getChildrens ({ commit, rootState }) {
    try {
      const userid = rootState.user.id
      const { data, error } = await this.$supabase
        .from('childrens')
        .select()
        .eq('parent_id', userid)
      if (error) { throw error }
      commit('setMine', data)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getReferrer ({ commit }, input) {
    try {
      const { data } = await this.$axios.post('Users/getWANumber', {
        ba_refcode: input,
        requester: 'member-masakinaja'
      })
      commit('setReferrer', data)
    } catch (error) {
      return error
    }
  }
}

export const mutations = {
  setMine (state, data) {
    state.mine = data
  },
  setReferrer (state, data) {
    state.referrer = data
  }
}
