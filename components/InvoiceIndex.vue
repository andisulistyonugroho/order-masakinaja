<template>
  <section :class="$vuetify.breakpoint.mobile ? 'pt-0' : 'pa-3'">
    <v-tabs v-model="tab">
      <v-tab>
        belum lunas
      </v-tab>
      <v-tab>
        lunas
      </v-tab>
    </v-tabs>
    <v-sheet class="px-4 pt-5 text-center">
      TOTAL: {{ totalBill|toMoney }}
    </v-sheet>
    <v-list two-line>
      <v-list-item-group v-model="orderIds" multiple active-class="primary--text">
        <v-list-item v-for="row in invoices" :key="row.id">
          <template #default="{active}">
            <v-list-item-content>
              <v-list-item-title>
                {{ row.childrens.call_name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ row.order_date|toDayDate }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ row.cooked_menus ? row.cooked_menus.name : '' }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text class="primary--text">
                Rp12.500
              </v-list-item-action-text>
              <v-icon :color="active ? 'yellow darken-3' : 'grey lighten-1'">
                {{ active ? 'mdi-basket-check' : 'mdi-basket' }}
              </v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-btn
      color="primary"
      rounded
      fixed
      right
      bottom
      style="right:10vw;"
    >
      <v-icon left>
        mdi-check
      </v-icon>
      bayar
    </v-btn>
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      tab: 0,
      orderIds: []
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      invoices: state => state.order.invoices
    }),
    totalBill () {
      return 12500 * this.invoices.length
    }
  },
  watch: {
    async tab (val) {
      await this.getOrderDataByStatus(val)
    }
  },
  async created () {
    this.$nuxt.$emit('TITLE_BAR', 'Tagihan')
    await this.getOrderDataByStatus(this.tab)
  },
  methods: {
    async getOrderDataByStatus (tabindex) {
      try {
        const state = tabindex === 1 ? 'paid' : 'unpaid'
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('order/getOrderByStatus', { status: state })
        this.$nuxt.$emit('WAIT_DIALOG', false)
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }
  }
}
</script>
