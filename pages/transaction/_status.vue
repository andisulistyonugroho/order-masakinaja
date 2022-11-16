<template>
  <v-container fluid>
    <v-card
      tile
      flat
      color="transparent"
    >
      <v-row>
        <v-col v-if="state !== 'unpaid'" cols="12" md="4" class="pb-0">
          <v-select
            v-model="status"
            :items="orderStates"
            label="Status"
            placeholder="Pilih status order"
            clearable
            class="caption"
          />
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                :value="dateRangeText"
                label="Tanggal Order"
                readonly
                v-bind="attrs"
                clearable
                class="caption"
                v-on="on"
                @click:clear="dates=null"
              />
            </template>
            <v-date-picker
              v-model="dates"
              range
              color="primary"
              no-title
              show-adjacent-months
            />
          </v-menu>
        </v-col>
        <v-col cols="12" md="4" class="pb-0">
          <v-text-field
            v-model="searchItem"
            label="Item"
            placeholder="Nama produk"
            clearable
            class="caption"
          />
        </v-col>
        <v-col cols="12" class="pt-0 mb-5">
          <v-btn block tile outlined color="secondary" @click="doFilter">
            Filter
          </v-btn>
        </v-col>
      </v-row>

      <v-divider />

      <v-data-table
        :headers="headers"
        :items="items"
        :sort-by="['createdAt', 'grandtotal']"
        :sort-desc="[true, false]"
        multi-sort
        class="pt-5"
      >
        <template #[`item.createdAt`]="{ item }">
          <div>{{ item.createdAt|toSimpleDate }}</div>
          <nuxt-link :to="`/order/${item.orderNumber}`" class="caption">
            {{ item.orderNumber }}
          </nuxt-link>
        </template>
        <template #[`item.orderItems`]="{ item }">
          <span v-for="(orderItem, index) in item.orderItems" :key="orderItem.id">
            {{ orderItem.productSet.name }}{{ index+1 === item.orderItems.length ? '' : ',' }}
          </span>
        </template>
        <template #[`item.grandTotal`]="{ item }">
          {{ item.invoices.grandTotal|toMoney }}
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip small>
            {{ item.status|orderStatus }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      state: this.$route.params.status,
      headers: [
        { text: 'Tgl Order', value: 'createdAt', width: '15%' },
        { text: 'Item', sortable: false, value: 'orderItems' },
        { text: 'Total Harga (Rp)', value: 'grandTotal', align: 'right' },
        { text: 'Status', value: 'status', align: 'right', width: '5%' }
      ],
      status: null,
      dates: null,
      menu2: false,
      searchItem: null
    }
  },
  computed: {
    ...mapState({
      items: state => state.transaction.all,
      orderState: state => state.user.orderState
    }),
    dateRangeText () {
      if (this.dates && this.dates.length === 2) {
        const [year, month, day] = this.dates[0].split('-')
        const [year1, month1, day1] = this.dates[1].split('-')
        return `${day}/${month}/${year} ~ ${day1}/${month1}/${year1} `
      } else {
        return ''
      }
    },
    orderStates () {
      if (this.state === 'inprocess') {
        return this.orderState.filter(obj => obj.value > 1 && obj.value < 4)
      } else if (this.state === 'all') {
        return this.orderState
      } else {
        return []
      }
    }
  },
  created () {
    this.$store.dispatch('transaction/getTransaction', {
      state: this.state
    })
    this.$nuxt.$emit('TITLE_BAR', 'Daftar Transaksi')
  },
  methods: {
    doFilter: debounce(function () {
      this.$nuxt.$emit('WAIT_DIALOG', true)
      if (this.dates) {
        this.dates[0] = this.$dayjs(this.dates[0]).startOf('day').utc().format('YYYY-MM-DD HH:mm')
        this.dates[1] = this.$dayjs(this.dates[1]).endOf('day').utc().format('YYYY-MM-DD HH:mm')
      }
      this.$store.dispatch('transaction/getTransaction', {
        status: this.status,
        dateRange: this.dates,
        state: this.state,
        search: this.searchItem
      })
      this.$nuxt.$emit('WAIT_DIALOG', false)
    }, 1500, { leading: true, trailing: false })
  }
}
</script>
