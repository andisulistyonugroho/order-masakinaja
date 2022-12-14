<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
    fullscreen
    transition="slide-x-reverse-transition"
  >
    <v-card tile>
      <v-card-title primary-title>
        {{ data.status|paymentStatus }}
        <v-spacer />
        <v-btn icon small @click="$emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-5 px-0">
        <v-container grid-list-xs>
          <v-row class="px-3">
            <v-col cols="6" class="text-uppercase font-weight-bold">
              <v-chip color="white" class="px-0">
                inv-masakinaja-{{ data.id }}
              </v-chip>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-chip color="white" class="primary--text pa-0">
                Lihat Invoice
              </v-chip>
            </v-col>
            <v-col cols="6">
              Katering santri
            </v-col>
            <v-col cols="6" class="text-right">
              {{ data.orders.length }} paket
            </v-col>
            <v-col cols="12">
              <v-divider />
            </v-col>
            <v-col class="title black--text" cols="12">
              Total Pembayaran
            </v-col>
            <v-col cols="6" class="black--text">
              Harga
            </v-col>
            <v-col cols="6" class="text-right font-weight-bold">
              Rp{{ data.amount | toMoney }}
            </v-col>
            <v-col cols="6" class="black--text">
              Kode Unik
            </v-col>
            <v-col cols="6" class="text-right font-weight-bold">
              20
            </v-col>
            <v-col cols="6" class="black--text">
              Total Pembayaran
            </v-col>
            <v-col cols="6" class="text-right font-weight-bold">
              Rp{{ (data.amount+20)|toMoney }}
            </v-col>
            <v-col cols="3" class="black--text">
              Tujuan
            </v-col>
            <v-col cols="9" class="text-right font-weight-bold">
              BSI 7141894425 an. Eka Aulia
            </v-col>
            <v-col cols="3" class="black--text">
              Tgl Bayar
            </v-col>
            <v-col cols="9" class="text-right font-weight-bold">
              {{ data.paid_at|toDateTime }}
            </v-col>
            <v-col cols="5" class="black--text">
              Konfirmasi Admin
            </v-col>
            <v-col cols="7" class="text-right font-weight-bold">
              {{ data.admin_confirmed_at|toDateTime }}
            </v-col>
            <v-col v-if="data.status === 2" cols="12">
              <v-form ref="form">
                <v-checkbox
                  v-model="checkbox"
                  label="Pembayaran sudah masuk ke rekening"
                  :rules="[v => !!v || 'Harus dicentang untuk melanjutkan']"
                />
              </v-form>
            </v-col>
          </v-row>
        </v-container>
        <v-btn
          v-if="false"
          block
          text
          depressed
          color="primary"
          class="mt-6 text-capitalize"
          rounded
          @click="doCancel"
        >
          batalkan transaksi
        </v-btn>
      </v-card-text>
      <v-card-actions v-if="data.status === 2">
        <v-btn
          block
          depressed
          color="primary"
          x-large
          rounded
          @click="paymentVerified()"
        >
          verifikasi
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import debounce from 'lodash.debounce'
export default {
  props: {
    dialog: { type: Boolean, default: false },
    data: { type: Object, default: null }
  },
  data () {
    return {
      checkbox: false
    }
  },
  methods: {
    doCancel: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('payment/cancelPayment', this.data.id)
        await this.$store.dispatch('order/removeOrderPaymentByPaymentId', this.data.id)

        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'Transaksi berhasil di batalkan'
        })
        this.$emit('closeit')
      } catch (error) {
        await this.$store.dispatch('payment/updatePaymentStatus', { paymentId: this.data.id, status: 1 })

        const selectedOrderId = this.data.orders.map(obj => obj.id)
        await this.$store.dispatch('order/setOrderPaymentId', {
          payment_id: this.data.id,
          selected_order_id: selectedOrderId
        })
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }, 1000, { leading: true, trailing: false }),
    paymentVerified: debounce(async function () {
      try {
        if (this.$refs.form.validate()) {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          await this.$store.dispatch('payment/updatePaymentStatus', { status: 3, paymentId: this.data.id })
          await this.$store.dispatch('order/updateOrderStatusByPaymentID', { status: 3, paymentId: this.data.id })
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'success',
            message: 'Pembayaran berhasil diverifikasi'
          })
          this.$emit('closeit')
        }
      } catch (error) {
        await this.$store.dispatch('payment/updatePaymentStatus', { status: 2, paymentId: this.data.id })
        await this.$store.dispatch('order/updateOrderStatusByPaymentID', { status: 2, paymentId: this.data.id })
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }, 1000, { leading: true, trailing: false })
  }
}
</script>
