<template>
  <v-app light>
    <div>
      <nuxt />
      <v-btn
        v-if="referrer"
        color="success"
        dark
        fixed
        bottom
        right
        rounded
        :small="$vuetify.breakpoint.mobile"
        :large="!$vuetify.breakpoint.mobile"
        @click="openWa(referrer.mobile)"
      >
        <v-icon left>
          mdi-whatsapp
        </v-icon>
        hubungi kami
      </v-btn>
      <v-snackbar
        v-model="snackbar.view"
        :color="snackbar.color"
        :timeout="2500"
        vertical
      >
        {{ snackbar.message }}
        <template #action="{ attrs }">
          <v-btn
            dark
            tile
            small
            v-bind="attrs"
            @click="snackbar.view = false"
          >
            tutup
          </v-btn>
        </template>
      </v-snackbar>
      <v-overlay v-model="waitDialog" z-index="1000">
        <v-card dark width="250">
          <v-card-subtitle>
            Silakan menunggu
            <v-progress-linear indeterminate class="mb-0" />
          </v-card-subtitle>
        </v-card>
      </v-overlay>
    </div>
  </v-app>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'Login',
  middleware: 'isUnauthenticated',
  data () {
    return {
      snackbar: { view: false, color: 'success', message: '' },
      refCode: this.$route.query.refcode,
      waitDialog: false
    }
  },
  computed: {
    ...mapState({
      referrer: state => state.customer.referrer
    })
  },
  created () {
    this.$nuxt.$on('WAIT_DIALOG', (theValue) => {
      this.waitDialog = theValue
    })

    this.$nuxt.$on('EAT_SNACKBAR', (theSnack) => {
      if (theSnack.message instanceof Error) {
        const theError = theSnack.message
        let theMessage = theError
        if (theError.response) {
          theMessage = `${theError.response.status} : ${theError.response.data.error.message}`
        }
        theSnack.message = theMessage
      }
      this.snackbar = theSnack
    })

    this.$store.dispatch('customer/getReferrer', this.refCode)
  },
  beforeDestroy () {
    this.$nuxt.$off('EAT_SNACKBAR')
    this.$nuxt.$off('WAIT_DIALOG')
  },
  methods: {
    openWa (data) {
      const phone = data.replace('0', '62')
      const message = 'Hai kak, Saya mau mendaftar sebagai customer Masakinaja dari web, boleh tanya-tanya dulu?'
      window.open(
        `https://api.whatsapp.com/send?phone=${phone}&text=${message}`,
        '_blank'
      )
    }
  }
}
</script>
