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
    <LazyAdminDetailOrder
      v-if="detailOrderDialog"
      :dialog="detailOrderDialog"
      :selecteddate="selectedDate"
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
      detailOrderDialog: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      todaysMenu: state => state.order.menu,
      sumOrders: state => state.order.sumOrders,
      orderInDate: state => state.order.orderInDate
    })
  },
  created () {
    this.$nuxt.$emit('TITLE_BAR', 'Pemesanan Katering')
  },
  methods: {
    async getEvents () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('order/countOrderInRange', {
          start_date: dayjs().startOf('month').utc(),
          end_date: dayjs().endOf('month').utc()
        })
        const events = this.sumOrders.map((obj) => {
          return {
            color: 'primary',
            name: `Ada ${obj.count} order`,
            timed: false,
            start: obj.order_date,
            end: obj.order_date
          }
        })
        this.events = events
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
      await this.$store.dispatch('order/getMenuByDate', date)

      this.selectedDate = date
      if (this.orderInDate.length > 0) {
        this.detailOrderDialog = true
      } else if (past === false && present === false) {
        this.orderDialog = true
      } else {
        alert('tidak ada order')
      }
      this.$nuxt.$emit('WAIT_DIALOG', false)
    }, 1000, { leading: true, trailing: false }),
    async closeIt () {
      await this.getEvents()
      this.orderDialog = false
      this.detailOrderDialog = false
    },
    async refreshOrderDetail (date) {
      await this.$store.dispatch('order/getOrderInDate', date)
    }
  }
}
</script>
