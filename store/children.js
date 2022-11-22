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
        .eq('is_active', true)
      if (error) { throw error }
      commit('setMine', data)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async addChild ({ commit, rootState }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('childrens')
        .insert([{
          parent_id: rootState.user.id,
          full_name: input.fullName,
          call_name: input.callName,
          level: input.level,
          class_room: input.classRoom,
          gender: input.gender,
          notes: input.notes,
          managed_by: rootState.user.id
        }])
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async editChild ({ commit, rootState }, input) {
    try {
      const { data, error } = await this.$supabase
        .from('childrens')
        .update({
          parent_id: rootState.user.id,
          full_name: input.fullName,
          call_name: input.callName,
          level: input.level,
          class_room: input.classRoom,
          gender: input.gender,
          notes: input.notes,
          managed_by: rootState.user.id
        })
        .match({ id: input.childId })
      if (error) { throw error }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
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
