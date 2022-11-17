export const state = () => ({
  all: [
    { icon: 'mdi-home', title: 'Home', to: '/', roles: ['ba'] }
  ],
  beforeLogin: null
})

export const actions = {
  setBeforeLogin ({ commit }, data) {
    commit('setBeforeLogin', data)
  },
  getMenuForMe ({ commit, rootState }) {
    const roleName = rootState.user.role[0].name

    const menu = [
      { icon: 'mdi-home', title: 'Home', to: '/', roles: ['customer'] },
      {
        icon: 'mdi-basket-outline',
        title: 'Transaksi',
        to: '/',
        roles: ['customer'],
        child: [
          { icon: '', title: 'Belum Dibayar', to: '/transaction/unpaid', roles: ['customer'] },
          { icon: '', title: 'Dalam Proses', to: '/transaction/inprocess', roles: ['customer'] },
          { icon: '', title: 'Semua Transaksi', to: '/transaction/all', roles: ['customer'] }
        ]
      }
    ]

    const menuAvailable = []
    for (let i = 0; i < menu.length; i++) {
      if (menu[i].child && menu[i].child.length > 0) { // having child menu
        const parent = {
          icon: menu[i].icon,
          title: menu[i].title,
          child: []
        }
        for (let j = 0; j < menu[i].child.length; j++) {
          if (menu[i].child[j].child && menu[i].child[j].child.length > 0) { // having grandchild menu
            const children = {
              icon: menu[i].child[j].icon,
              title: menu[i].child[j].title,
              child: []
            }
            for (let k = 0; k < menu[i].child[j].child.length; k++) {
              const menuGrandChild = menu[i].child[j].child[k].roles
              if (menuGrandChild.includes(roleName)) {
                children.child.push(menu[i].child[j].child[k])
              }
            }
            if (children.child.length > 0) {
              parent.child.push(children)
            }
          } else {
            const menuChild = menu[i].child[j].roles
            if (menuChild.includes(roleName)) {
              parent.child.push(menu[i].child[j])
            }
          }
        }

        if (parent.child.length > 0) {
          menuAvailable.push(parent)
        }
      } else {
        const menuRoles = menu[i].roles
        if (menuRoles.includes(roleName)) {
          menuAvailable.push(menu[i])
        }
      }
    }
    commit('reset')
    commit('setAll', menuAvailable)
  },
  removeArray ({ commit }, payload) {
    for (let i = 0; i < payload.arr.length; i++) {
      if (payload.arr[i] === payload.search) {
        payload.arr.splice(i, 1)
        i--
      }
    }
  }
}

export const mutations = {
  setAll (state, data) {
    state.all = data
  },
  reset (state) {
    state.all = [
      { icon: 'home', title: 'Home', to: '/', roles: ['ba'] }
    ]
  },
  setBeforeLogin (state, data) {
    state.beforeLogin = data || null
  }
}

export const getters = {
  getBeforeLogin: (state) => {
    return state.beforeLogin
  }
}
