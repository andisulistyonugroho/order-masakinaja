const isCypress = typeof window.Cypress !== 'undefined'

export default ({ store }) => {
  if (isCypress) {
    // expose store to cypress browser window
    window.__store__ = store
  }
}
