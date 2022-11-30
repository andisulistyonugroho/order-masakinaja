<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
    fullscreen
  >
    <v-card tile class="mx-0">
      <v-card-title primary-title>
        Pembayaran
        <v-spacer />
        <v-btn icon small @click="$emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height:90vh" class="pt-5 px-0">
        <v-row class="px-6">
          <v-col cols="6" class="text-uppercase font-weight-bold">
            <v-chip color="white" class="px-0">
              inv-masakinaja-1
            </v-chip>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-chip color="white" class="primary--text">
              Lihat Invoice
            </v-chip>
          </v-col>
          <v-col cols="6">
            Transfer sebelum
          </v-col>
          <v-col cols="6" class="text-right">
            29 Nop 2022 23:00
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
            Rp100.000
          </v-col>
          <v-col cols="6" class="font-weight-bold black--text">
            Kode Unik
          </v-col>
          <v-col cols="6" class="text-right font-weight-bold">
            20
          </v-col>
        </v-row>
        <v-row class="px-6" style="background-color:#e1e5e8">
          <v-col cols="2">
            <v-img src="/logo-bsi@30.png" max-width="35" class="white" />
          </v-col>
          <v-col cols="10" class="pl-0 my-1 font-weight-bold">
            Eka Aulia
          </v-col>
          <v-col cols="12" class="py-0">
            <v-text-field
              value="23424240984204"
              readonly
              solo
              flat
              background-color="white"
              append-icon="mdi-content-copy"
              @click:append="copy2Clipboard('123')"
            />
          </v-col>
          <v-col cols="12" class="pt-0">
            <span class="black--text">Total Pembayaran</span>
            <v-text-field
              prefix="Rp"
              value="100000"
              readonly
              solo
              flat
              background-color="white"
              append-icon="mdi-content-copy"
              @click:append="copy2Clipboard('456')"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  methods: {
    async copy2Clipboard (value) {
      console.log(value)
      await navigator.clipboard.writeText(value)
      this.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: 'error'
      })
    }
  }
}
</script>
