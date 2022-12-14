<template>
  <section :class="$vuetify.breakpoint.mobile ? 'pt-0' : 'pa-3'">
    <v-sheet class="d-flex">
      <v-toolbar dense flat>
        <v-btn
          fab
          text
          small
          @click="$refs.calendar.prev()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer />
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          small
          fab
          text
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
    <LazyDetailOrder
      v-if="detailOrderDialog"
      :dialog="detailOrderDialog"
      :selecteddate="selectedDate"
      :santris="childrens"
      :orderindate="orderInDate"
      :todaysmenu="todaysMenu"
      @closeit="closeIt"
      @refreshorderdetail="refreshOrderDetail"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      type: 'month',
      mode: 'stack',
      modes: ['stack', 'column'],
      weekday: [1, 2, 3, 4],
      value: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      orderDialog: false,
      selectedDate: '',
      detailOrderDialog: false,
      calendarDate: { start: null, end: null }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      childrens: state => state.children.mine,
      todaysMenu: state => state.order.menu,
      orders: state => state.order.orders,
      orderInDate: state => state.order.orderInDate
    })
  },
  created () {
    this.$nuxt.$emit('TITLE_BAR', 'Pemesanan Katering')
  },
  mounted () {
    if (!this.profile.updated_at) {
      this.$nuxt.$emit('ONBOARDING_ADD_CHILD', true)
      this.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: 'Silakan isi data ananda yang akan ikut katering.'
      })
    }
  },
  methods: {
    async getEvents ({ start, end }) {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('order/getOrderInRange', {
          start_date: dayjs(start.date).startOf('month').utc(),
          end_date: dayjs(end.date).endOf('month').utc()
        })
        const events = this.orders.map((obj) => {
          return {
            color: 'cyan',
            name: obj.childrens.call_name,
            timed: false,
            start: obj.order_date,
            end: obj.order_date
          }
        })
        this.events = events
        this.calendarDate = { start, end }
        this.$nuxt.$emit('WAIT_DIALOG', false)
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    openOrderModel: debounce(async function ({ date, past, present }) {
      this.$nuxt.$emit('WAIT_DIALOG', true)
      await this.$store.dispatch('order/getOrderInDate', date)

      await this.$store.dispatch('children/getChildrens')
      await this.$store.dispatch('order/getMenuByDate', date)

      this.selectedDate = date
      if (this.orderInDate.length > 0) {
        this.detailOrderDialog = true
      } else if (past === false && present === false) {
        this.orderDialog = true
      } else if (present === true) {
        const lastchance = this.$dayjs(date).startOf('date').add(7, 'hour')
        const thistime = this.$dayjs()
        if (thistime.isAfter(lastchance)) {
          alert('Afwan, pemesanan terakhir pukul 7:00 pagi')
        }
      } else {
        alert('tidak ada pesanan')
      }
      this.$nuxt.$emit('WAIT_DIALOG', false)
    }, 1000, { leading: true, trailing: false }),
    async closeIt () {
      await this.getEvents(this.calendarDate)
      this.orderDialog = false
      this.detailOrderDialog = false
    },
    async refreshOrderDetail (date) {
      await this.$store.dispatch('order/getOrderInDate', date)
    }
  }
}
</script>
