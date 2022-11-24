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
        @click:date="openCookingDialog"
        @change="getEvents"
      />
    </v-sheet>
    <LazyAdminMenuInDate
      v-if="cookingDialog"
      :dialog="cookingDialog"
      :selecteddate="selectedDate"
      :todaysmenu="todaysMenu"
      :allcooking="allCooking"
      @closeit="closeIt"
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
      value: '',
      type: 'month',
      mode: 'stack',
      weekday: [1, 2, 3, 4],
      events: [],
      cookingDialog: false,
      selectedDate: '',
      calendarDate: { start: null, end: null }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      todaysMenu: state => state.order.menu,
      menuInRange: state => state.cooking.menuInRange,
      allCooking: state => state.cooking.all
    })
  },
  created () {
    this.$nuxt.$emit('TITLE_BAR', 'Menu Harian')
  },
  methods: {
    async getEvents ({ start, end }) {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('cooking/getMenuInRange', {
          start_date: dayjs(start.date).startOf('month').utc(),
          end_date: dayjs(end.date).endOf('month').utc()
        })
        const events = this.menuInRange.map((obj) => {
          return {
            color: 'primary',
            name: obj.cooked_menus.name,
            details: obj.cooked_menus.details,
            timed: false,
            start: obj.menu_date,
            end: obj.menu_date
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
    openCookingDialog: debounce(async function ({ date }) {
      this.$nuxt.$emit('WAIT_DIALOG', true)
      await this.$store.dispatch('order/getMenuByDate', date)
      await this.$store.dispatch('cooking/getAll')

      this.selectedDate = date
      this.cookingDialog = true
      this.$nuxt.$emit('WAIT_DIALOG', false)
    }, 1000, { leading: true, trailing: false }),
    async closeIt () {
      await this.getEvents(this.calendarDate)
      this.cookingDialog = false
    }
  }
}
</script>
