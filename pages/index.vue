<template>
  <section :class="$vuetify.breakpoint.mobile ? 'pt-0' : 'pa-3'">
    <v-sheet class="d-flex">
      <v-toolbar dense flat>
        <v-btn
          icon
          class="ma-2"
          @click="$refs.calendar.prev()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>

        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          icon
          class="ma-2"
          @click="$refs.calendar.next()"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="85vh">
      <v-calendar
        ref="calendar"
        v-model="value"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @click:date="openOrderModel"
        @change="getEvents"
      />
    </v-sheet>
    <OrderInDate
      :dialog="orderDialog"
      :selecteddate="selectedDate"
      :santris="childrens"
      :todaysmenu="todaysMenu"
      @closeit="closeIt"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      type: 'month',
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [0, 1, 2, 3, 4, 5, 6],
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      orderDialog: false,
      selectedDate: ''
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      childrens: state => state.children.mine,
      todaysMenu: state => state.order.menu
    })
  },
  created () {
    this.$nuxt.$emit('TITLE_BAR', 'Pemesanan Katering')
  },
  mounted () {
    if (!this.profile.updated_at) {
      this.$nuxt.$emit('ONBOARDING_CHANGE_PASSWD', true)
      this.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: 'Anda masih menggunakan password yang digenerate oleh sistem, sangat dianjurkan untuk mengganti password sebelum melanjutkan.'
      })
    }
  },
  methods: {
    getEvents ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay
        })
      }

      this.events = events
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    openOrderModel: debounce(async function ({ date }) {
      this.$nuxt.$emit('WAIT_DIALOG', true)
      this.selectedDate = date
      await this.$store.dispatch('children/getChildrens')
      await this.$store.dispatch('order/getMenuByDate', date)
      this.orderDialog = true
      this.$nuxt.$emit('WAIT_DIALOG', false)
    }, 1000, { leading: true, trailing: false }),
    closeIt () {
      this.orderDialog = false
    }
  }
}
</script>
