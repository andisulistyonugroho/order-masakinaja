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
        Status Transaksi
        <v-spacer />
        <v-btn icon small @click="$emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="px-0">
        <v-stepper value="2" alt-labels flat>
          <v-stepper-header>
            <v-stepper-step step="1" complete>
              Pembayaran
            </v-stepper-step>
            <v-divider />
            <v-stepper-step step="2">
              Verifikasi
            </v-stepper-step>
            <v-divider />
            <v-stepper-step step="3">
              Selesai
            </v-stepper-step>
          </v-stepper-header>
        </v-stepper>
        <v-container grid-list-xs>
          <v-row class="px-3">
            <v-col cols="12" class="text-center">
              Tim kami sedang memproses transaksimu. Terimakasih sudah menunggu :)
            </v-col>
            <v-col class="text-uppercase black--text" cols="6">
              in-{{ data.created_at|toInvoice }}-{{ data.id }}
            </v-col>
            <v-col cols="6" class="text-right primary--text">
              Lihat Invoice
            </v-col>
          </v-row>
          <v-row class="px-3" style="background-color:#e1e5e8">
            <v-col cols="2">
              <v-img src="/logo-bsi@30.png" max-width="35" class="white" />
            </v-col>
            <v-col cols="10" class="pl-0 my-1 font-weight-bold">
              BSI an. Eka Aulia
            </v-col>
            <v-col cols="12" class="py-0">
              <v-text-field
                value="7141894425"
                readonly
                solo
                flat
                background-color="white"
                append-icon="mdi-content-copy"
                @click:append="copy2Clipboard('7141894425')"
              />
            </v-col>
            <v-col cols="12" class="py-0">
              <span class="black--text">Total Pembayaran</span>
              <v-text-field
                prefix="Rp"
                :value="data.amount|toMoney"
                readonly
                solo
                flat
                background-color="white"
                append-icon="mdi-content-copy"
                @click:append="copy2Clipboard(data.amount)"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              Untuk mempercepat proses verifikasi, silakan kirim bukti transfer
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="green"
          class="ma-2 white--text"
          block
          depressed
          rounded
          x-large
          @click="openWa(adminphone)"
        >
          kirim bukti transfer
          <v-icon
            right
            dark
          >
            mdi-whatsapp
          </v-icon>
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
      adminphone: process.env.ADMINPHONE
    }
  },
  methods: {
    async copy2Clipboard (value) {
      await navigator.clipboard.writeText(value)
      this.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'success',
        message: 'Berhasil di salin'
      })
    },
    openWa: debounce(function (phonenumber) {
      const phone = phonenumber.replace('0', '62')
      const invoiceNumber = this.dayjs(this.data.created_at)
        .local()
        .format('YYYYMMDD')
      const message = `Assalamu'alaikum admin, berikut bukti transfer saya untuk INV-{${invoiceNumber}}-${this.data.id}`
      window.open(
        `https://api.whatsapp.com/send?phone=${phone}&text=${message}`,
        '_blank'
      )
    }, 1000, { leading: true, trailing: false })
  }
}
</script>
