<template>
  <section :class="$vuetify.breakpoint.mobile ? 'pt-0' : 'pa-3'">
    <v-select
      v-model="tab"
      :items="items"
      label="Status"
      class="px-3"
    />
    <v-row v-show="(tab === 1)" class="px-4">
      <v-col cols="6">
        <div class="font-weight-bold caption">
          TOTAL: {{ totalBill|toMoney }}<br>
          SISA: {{ totalLeft|toMoney }}
        </div>
      </v-col>
      <v-col cols="6">
        <div class="font-weight-bold primary--text caption text-right">
          BAYAR: {{ totalPaid|toMoney }}
        </div>
      </v-col>
    </v-row>
    <v-list two-line>
      <v-list-item-group v-if="unPaid" id="invoices-unpaid">
        <v-list-item v-for="payment in unPaid" :key="payment.id" @click="viewInvoice(payment)">
          <v-list-item-content>
            <v-list-item-title>
              <span class="text-uppercase">inv-masakinaja.{{ payment.id }}</span>
            </v-list-item-title>
            <v-list-item-subtitle>{{ payment.created_at|toDayDate }}</v-list-item-subtitle>
            <v-list-item-subtitle>Pembayaran {{ payment.orders.length }} paket katering</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text class="primary--text">
              Rp{{ payment.amount|toMoney }}
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>

      <v-list-item-group v-model="orderIds" multiple active-class="primary--text">
        <template v-if="tab === 1">
          <v-list-item v-for="row in unInvoiced" :key="row.id" @click="selectingOrder(row)">
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
                <v-icon :color="active ? 'green darken-1' : 'grey lighten-1'">
                  {{ active ? 'mdi-basket-check' : 'mdi-basket' }}
                </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
        <template v-else-if="tab === 4">
          <v-list-item v-for="row in invoices" :key="row.id" @click="selectingOrder(row)">
            <template #default="{active}">
              <v-list-item-content>
                <v-list-item-title>
                  <div class="caption primary--text">
                    inv-masakinaja-{{ row.payment_id }}
                  </div>
                  {{ row.childrens.call_name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ row.order_date|toDayDate }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ row.cooked_menus ? row.cooked_menus.name : '' }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-list-item-action-text class="primary--text">
                  Rp12.500
                </v-list-item-action-text>
                <v-icon :color="active ? 'green darken-1' : 'grey lighten-1'">
                  {{ active ? 'mdi-basket-check' : 'mdi-basket' }}
                </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>
        </template>
      </v-list-item-group>
    </v-list>
    <v-btn
      v-if="totalPaid > 0"
      color="primary"
      rounded
      fixed
      right
      bottom
      style="right:10vw;bottom:10vmax;"
      @click="confirmInvoiceGeneratingDialog = true"
    >
      <v-icon left>
        mdi-check
      </v-icon>
      bayar
    </v-btn>
    <LazyInvoiceDetail
      v-if="invoiceDialog"
      :dialog="invoiceDialog"
      :data="selectedPayment"
      @closeit="closeIt"
      @ihavetransfered="iHaveTransfered"
    />
    <v-dialog
      v-model="confirmInvoiceGeneratingDialog"
      persistent
      scrollable
    >
      <v-sheet class="pa-3">
        Anda akan melakukan pembayaran untuk {{ selectedOrder.length }} paket katering  sebesar <span class="primary--text font-weight-bold">Rp{{ totalPaid|toMoney }}</span><br>
        <span class="caption">mau lanjut ke pembayaran?</span>
        <div class="d-flex pt-2">
          <v-spacer />
          <v-btn color="primary" text rounded class="mr-2" @click="confirmInvoiceGeneratingDialog = false">
            tidak
          </v-btn>
          <v-btn color="primary" rounded depressed @click="createPayment()">
            ya
          </v-btn>
        </div>
      </v-sheet>
    </v-dialog>
    <LazyInvoiceStatus
      v-if="invoiceStatusDialog"
      :dialog="invoiceStatusDialog"
      :data="selectedPayment"
      @closeit="closeInvoiceStatus"
    />
  </section>
</template>
<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      tab: 1,
      orderIds: [],
      items: [
        { value: 1, text: 'Belum Lunas' },
        { value: 2, text: 'Sedang dicek' },
        { value: 3, text: 'Lunas' },
        { value: 4, text: 'Refund' }
      ],
      selectedOrder: [],
      confirmInvoiceGeneratingDialog: false,
      invoiceDialog: false,
      selectedPayment: null,
      invoiceStatusDialog: false
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
    },
    totalPaid () {
      return 12500 * this.selectedOrder.length
    },
    totalLeft () {
      return this.totalBill - this.totalPaid
    },
    unPaid () {
      // if (this.tab !== 1) {
      // return []
      // }
      const unpaid = []
      for (const row of this.invoices) {
        const index = unpaid.findIndex(obj => obj.id === row.payment_id)
        if (index >= 0) {
          unpaid[index].orders.push(row)
        } else if (row.payments) {
          const l = row.payments
          l.orders = [row]
          unpaid.push(l)
        }
      }
      return unpaid
    },
    unInvoiced () {
      if (this.tab === 1) {
        const unpaid = []
        for (const row of this.invoices) {
          if (!row.payments) {
            unpaid.push(row)
          }
        }
        return unpaid
      } else {
        return []
      }
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
    async getOrderDataByStatus (state) {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        this.selectedOrder = []
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
    },
    selectingOrder (data) {
      if (!this.selectedOrder.includes(data.id)) {
        this.selectedOrder.push(data.id)
      } else {
        this.$store.dispatch('menu/removeArray', { arr: this.selectedOrder, search: data.id })
      }
    },
    createPayment: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        const order2Pay = {
          list_order_id: this.selectedOrder,
          amount: this.totalPaid,
          profile_id: this.userId
        }
        const payment = await this.$store.dispatch('payment/createPayment', order2Pay)
        await this.$store.dispatch('order/setOrderPaymentId', {
          selected_order_id: this.selectedOrder,
          payment_id: payment[0].id
        })
        const invoicepayment = payment[0]
        invoicepayment.orders = this.invoices.filter(obj => this.selectedOrder.includes(obj.id))
        this.confirmInvoiceGeneratingDialog = false
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.viewInvoice(invoicepayment)
        await this.getOrderDataByStatus(this.tab)
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
        this.confirmInvoiceGeneratingDialog = false
      }
    }),
    viewInvoice (payment) {
      this.orderIds = []
      this.selectedPayment = payment
      if (payment.status === 1) {
        this.invoiceDialog = true
      } else {
        this.invoiceStatusDialog = true
      }
    },
    async closeIt () {
      this.invoiceDialog = false
      await this.getOrderDataByStatus(this.tab)
    },
    iHaveTransfered () {
      this.invoiceStatusDialog = true
      this.closeIt()
    },
    async closeInvoiceStatus () {
      this.invoiceStatusDialog = false
      await this.getOrderDataByStatus(this.tab)
    }
  }
}
</script>
