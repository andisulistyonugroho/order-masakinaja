import Vue from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/id'
dayjs.locale('id')

dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)

Vue.filter('toDayDate', val =>
  val
    ? dayjs(val)
      .local()
      .format('dddd, DD MMM YYYY')
    : '-'
)

Vue.filter('toDate', val =>
  val
    ? dayjs(val)
      .local()
      .format('DD MMM, YYYY')
    : '-'
)

Vue.filter('toDateTime', val =>
  val
    ? dayjs(val)
      .local()
      .format('DD MMM YYYY, HH:mm') + ' WIB'
    : '-'
)

Vue.filter('toSimpleDate', val =>
  val
    ? dayjs(val)
      .local()
      .format('DD/MM/YYYY')
    : '-'
)

Vue.filter('toInvoice', val =>
  val
    ? dayjs(val)
      .local()
      .format('YYYYMMDD')
    : '-'
)

Vue.filter('timeFromNow', (val) => {
  return dayjs(val).fromNow()
})

Vue.filter('timeFormat', (val, format) => {
  return dayjs(val).format(format)
})

Vue.filter('toAvaUrl', (val) => {
  if (val === null) {
    return '/v.png'
  }
  // eslint-disable-next-line no-undef
  const baseURL = $nuxt.$axios.defaults.baseURL
  return `${baseURL}/space/avatar/download/${val}`
})

Vue.filter('toBreadcrumbItem', (val) => {
  const item = [
    { text: 'Home', disabled: false, to: '/' },
    { text: 'Dashboard', disabled: false, to: '/dashboard' }
  ]
  if (val && val !== '/dashboard') {
    const result = val.split('/')
    result.shift()
    let goto = ''
    for (let i = 0; i < result.length; i++) {
      goto = goto + '/' + result[i]
      item.push({
        text: result[i],
        disabled: i === result.length - 1,
        exact: true,
        to: goto
      })
    }
  }
  return item
})

Vue.filter('spesificationKey', (val) => {
  let rep = val
  if (rep) {
    rep = val.replace(/_/g, ' ')
  }
  return rep
})

Vue.filter('toAttachUrl', (val) => {
  // eslint-disable-next-line no-undef
  const baseURL = $nuxt.$axios.defaults.baseURL
  // eslint-disable-next-line no-undef
  const tok = $nuxt.$store.state.user.token
  if (val) {
    const value = val.replace(/\//g, '%2F')
    return `${baseURL}/${process.env.storage}/${process.env.container}/download/${value}?access_token=${tok}`
  } else {
    return null
  }
})

Vue.filter('toPDFUrl', (val) => {
  // eslint-disable-next-line no-undef
  const baseURL = $nuxt.$axios.defaults.baseURL
  // eslint-disable-next-line no-undef
  const tok = $nuxt.$store.state.user.token
  if (val) {
    const value = val.replace(/\//g, '%2F')
    return `${baseURL}/${process.env.storage}/${process.env.container}/download/${value}#view=fitH&toolbar=0&access_token=${tok}`
  } else {
    return null
  }
})

Vue.filter('toImage', (val) => {
  // eslint-disable-next-line no-undef
  const baseURL = $nuxt.$axios.defaults.baseURL
  // eslint-disable-next-line no-undef
  const tok = $nuxt.$store.state.user.token
  if (val) {
    const value = val.replace(/\//g, '%2F')
    return `${baseURL}/${process.env.storage}/${process.env.container}/download/${value}?access_token=${tok}`
  } else {
    return 'https://elearnings.sgp1.cdn.digitaloceanspaces.com/parentingrasulullah/logo-pr.png'
  }
})

Vue.filter('toCDN', (val) => {
  if (val) {
    return `https://elearnings.sgp1.cdn.digitaloceanspaces.com/${val}`
  } else {
    return 'https://elearnings.sgp1.cdn.digitaloceanspaces.com/parentingrasulullah/logo-pr.png'
  }
})

Vue.filter('toPrivateCDN', (val) => {
  // eslint-disable-next-line no-undef
  const baseURL = $nuxt.$axios.defaults.baseURL
  // eslint-disable-next-line no-undef
  const tok = $nuxt.$store.state.user.token
  if (val) {
    const value = val.replace(/\//g, '%2F')
    return `${baseURL}/${process.env.cdn}/${process.env.container}/download/${value}?access_token=${tok}`
  } else {
    return 'https://elearnings.sgp1.cdn.digitaloceanspaces.com/parentingrasulullah/logo-pr.png'
  }
})

Vue.filter('date2UTC', (val) => {
  let newDate = new Date()
  if (val) {
    newDate = new Date(val)
  }
  return newDate
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ')
})

Vue.filter('toFixed', (val) => {
  if (val) {
    return val.toFixed(2)
  } else {
    return '0'
  }
})

Vue.filter('toMoney', val => (val ? val.toLocaleString('it-IT') : '-'))

Vue.filter('toPeriode', (val) => {
  const date = val.substr(8, 2)
  const periode = Math.ceil(date / 7)
  return `#${periode}${dayjs(val).format('MMM')}`
})

Vue.filter('toPercentage', (val) => {
  return val > 0 ? val * 100 : 0
})

Vue.filter('toDuration', (val) => {
  return dayjs.duration(val).minutes()
})

Vue.filter('orderStatus', (val) => {
  let state = 'False'
  if (val === 1) {
    state = 'Belum lunas'
  } else if (val === 2) {
    state = 'Menunggu konfirmasi'
  } else if (val === 3) {
    state = 'Terbayar'
  } else if (val === 4) {
    state = 'Terkirim'
  } else if (val === 0) {
    state = 'Batal'
  }
  return state
})

Vue.filter('paymentStatus', (val) => {
  let state = 'False'
  if (val === 1) {
    state = 'Belum lunas'
  } else if (val === 2) {
    state = 'Perlu Verifikasi'
  } else if (val === 3) {
    state = 'Terbayar'
  } else if (val === 4) {
    state = 'Refund'
  } else if (val === 0) {
    state = 'Batal'
  }
  return state
})
