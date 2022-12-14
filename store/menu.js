export const state = () => ({
  all: [
    { icon: 'mdi-home', title: 'Home', to: '/' }
  ],
  beforeLogin: null
})

export const actions = {
  setBeforeLogin ({ commit }, data) {
    commit('setBeforeLogin', data)
  },
  getMenuForMe ({ commit, rootState }) {
    const roleName = rootState.user.profile.acl_role

    const menu = [
      { icon: 'mdi-home', title: 'Home', to: '/', roles: ['superadmin', 'member'] },
      { icon: 'mdi-basket-outline', title: 'Tagihan', to: '/invoice', roles: ['member'] },
      { icon: 'mdi-receipt-outline', title: 'Tagihan', to: '/invoice', roles: ['superadmin'] },
      {
        icon: 'mdi-basket-outline',
        title: 'Pesanan',
        to: '/orders',
        roles: ['superadmin']
      },
      {
        icon: 'mdi-food-turkey',
        title: 'Masakan',
        to: '/',
        roles: ['superadmin'],
        child: [
          { icon: '', title: 'Menu Dasar', to: '/cooking/basic', roles: ['superadmin'] },
          { icon: '', title: 'Menu Harian', to: '/cooking/daily', roles: ['superadmin'] }
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
