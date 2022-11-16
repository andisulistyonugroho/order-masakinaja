export default function ({ store, redirect, route }) {
  if (!store.state.user.token) {
    return redirect('/login?refcode=' + route.query.refcode)
  }
}
