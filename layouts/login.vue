<template>
  <v-app light>
    <div>
      <nuxt />
      <v-btn
        color="success"
        dark
        fixed
        bottom
        right
        rounded
        :small="$vuetify.breakpoint.mobile"
        :large="!$vuetify.breakpoint.mobile"
        @click="openWa(adminphone)"
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
export default {
  name: 'Login',
  middleware: 'isUnauthenticated',
  data () {
    return {
      snackbar: { view: false, color: 'success', message: '' },
      refCode: this.$route.query.refcode,
      waitDialog: false,
      adminphone: '085759397500'
    }
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
  },
  beforeDestroy () {
    this.$nuxt.$off('EAT_SNACKBAR')
    this.$nuxt.$off('WAIT_DIALOG')
  },
  methods: {
    openWa (data) {
      const phone = data.replace('0', '62')
      const message = 'Assalamu\'alaikum admin, saya mau bertanya.'
      window.open(
        `https://api.whatsapp.com/send?phone=${phone}&text=${message}`,
        '_blank'
      )
    }
  }
}
</script>
