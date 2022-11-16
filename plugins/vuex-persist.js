import VuexP from 'vuex-persist'

export default ({ store }) => {
  new VuexP({
    /* your options */
    key: 'masakinajacu',
    modules: ['user']
  }).plugin(store)
}
