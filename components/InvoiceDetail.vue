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
        Pembayaran
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
              <v-chip color="white" class="primary--text">
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
            <v-col cols="6" class="font-weight-bold black--text">
              Harga
            </v-col>
            <v-col cols="6" class="text-right font-weight-bold">
              Rp{{ data.amount | toMoney }}
            </v-col>
            <v-col cols="6" class="font-weight-bold black--text">
              Kode Unik
            </v-col>
            <v-col cols="6" class="text-right font-weight-bold">
              20
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
                :value="(data.amount+20)|toMoney"
                readonly
                solo
                flat
                background-color="white"
                append-icon="mdi-content-copy"
                @click:append="copy2Clipboard(data.amount+20)"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-btn
          block
          text
          depressed
          color="primary"
          class="mt-6 text-capitalize"
          rounded
        >
          batalkan transaksi
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-btn block depressed color="primary" x-large rounded>
          Saya sudah transfer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: { type: Boolean, default: false },
    data: { type: Object, default: null }
  },
  methods: {
    async copy2Clipboard (value) {
      await navigator.clipboard.writeText(value)
      this.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'success',
        message: 'Berhasil di salin'
      })
    }
  }
}
</script>
