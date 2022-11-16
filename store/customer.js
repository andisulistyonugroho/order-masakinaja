export const state = () => ({
  found: [],
  province: [],
  downline: [],
  supervisor: [],
  communities: [],
  referrer: {}
})

export const actions = {
  findCustomer ({ commit }, data) {
    this._vm.$nuxt.$emit('WAIT_DIALOG', true)
    this.$axios.get('/Customers', {
      params: {
        filter: {
          where: {
            isActive: true,
            userId: data.userId,
            or: [
              { name: { like: `%${data.search}%`, options: 'i' } },
              { email: { like: `%${data.search}%`, options: 'i' } },
              { mobile: { like: `%${data.search}%`, options: 'i' } }
            ]
          },
          include: {
            relation: 'shippingAddresses',
            scope: {
              where: { isActive: true },
              include: ['Province', 'City', 'District']
            }
          }
        }
      }
    }).then((response) => {
      // give an object "found" for autocomplete item-text
      const responseData = response.data
      for (let i = 0; i < responseData.length; i++) {
        responseData[i].found = data.search
      }
      commit('setFound', responseData)
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
    }).catch((error) => {
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    })
  },
  getProvince ({ commit }) {
    this.$axios.get('/Provinces', {
      params: {
        filter: {
          where: { isActive: true },
          include: {
            relation: 'city',
            scope: {
              include: 'district'
            }
          }
        }
      }
    }).then((response) => {
      commit('setProvince', response.data)
    })
  },
  async getDownline ({ commit }, request) {
    try {
      this._vm.$nuxt.$emit('WAIT_DIALOG', true)
      const { data } = await this.$axios.get('/UserProfiles/findOne', {
        params: {
          filter: {
            where: { userId: request.userId },
            include: 'downline'
          }
        }
      })
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      commit('setDownline', data)
    } catch (error) {
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    }
  },
  async newDownline ({ commit }, input) {
    try {
      const { data } = await this.$axios.post('/Users/addDownline', input)
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async getSupervisor ({ commit }, input) {
    try {
      this._vm.$nuxt.$emit('WAIT_DIALOG', true)
      const { data } = await this.$axios.get('/UserProfiles', {
        params: {
          filter: {
            where: {
              communityId: input.communityId,
              users: { role: { id: 4 } }
            }
          }
        }
      })
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      commit('setSupervisor', data)
    } catch (error) {
      this._vm.$nuxt.$emit('WAIT_DIALOG', false)
      this._vm.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: error
      })
    }
  },
  async getCommunities ({ commit }) {
    const { data } = await this.$axios.get('/Communities', {
      isActive: true
    })
    commit('setCommunities', data)
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
  setFound (state, data) {
    state.found = data
  },
  setProvince (state, data) {
    state.province = data
  },
  setDownline (state, data) {
    state.downline = data
  },
  setSupervisor (state, data) {
    state.supervisor = data
  },
  setCommunities (state, data) {
    state.communities = data
  },
  setReferrer (state, data) {
    state.referrer = data
  }
}
