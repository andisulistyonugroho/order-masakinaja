<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      light
      class=""
    >
      <TheMenu />
    </v-navigation-drawer>
    <v-app-bar color="#ffffff" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <span class="title">{{ title }}</span>
      <v-spacer />
      <v-menu
        bottom
      >
        <template #activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon size="35" color="primary">
              mdi-account-circle
            </v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="changePasswordDialog = true">
            <v-list-item-title>GANTI PASSWORD</v-list-item-title>
          </v-list-item>
          <v-list-item to="/profile">
            <v-list-item-title>PROFIL</v-list-item-title>
          </v-list-item>
          <v-list-item @click="doLogout">
            <v-list-item-title>LOGOUT</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main class="bg-body">
      <nuxt />
    </v-main>
    <ChangePassword :dialog="changePasswordDialog" @close-it="closeIt" />
    <v-overlay v-model="waitDialog" z-index="1000">
      <v-card dark width="250">
        <v-card-subtitle>
          Silakan menunggu
          <v-progress-linear indeterminate class="mb-0" />
        </v-card-subtitle>
      </v-card>
    </v-overlay>
    <v-snackbar
      v-model="snackbar.view"
      :color="snackbar.color"
      :timeout="4500"
      bottom
      multi-line
    >
      {{ snackbar.message }}
      <template #action="{ attrs }">
        <v-btn
          dark
          v-bind="attrs"
          @click="snackbar.view = false"
        >
          tutup
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'DefaultLayout',
  middleware: 'isAuthenticated',
  data () {
    return {
      drawer: true,
      title: '',
      waitDialog: false,
      snackbar: { view: false, color: 'success', message: '' },
      icons: [],
      changePasswordDialog: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      user: state => (state.user.profile ? state.user.profile.fullname : null),
      profile: state => state.user.profile
    })
  },
  created () {
    this.$nuxt.$on('ONBOARDING_CHANGE_PASSWD', () => {
      this.changePasswordDialog = true
    })
    this.$nuxt.$on('TITLE_BAR', (theValue) => {
      this.title = theValue
    })
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
    doLogout () {
      this.$store.dispatch('user/doLogout').then(() => {
        this.$router.replace({ path: '/login' })
      })
    },
    goFront () {
      if (this.$router.history.current.path !== '/') {
        this.$router.push('/')
      }
    },
    async closeIt () {
      this.changePasswordDialog = false
      if (!this.profile.joinDate) {
        await this.$axios.patch(`/UserProfiles/${this.profile.id}`, { joinDate: new Date() })
        await this.$store.dispatch('user/getMyProfile', this.userId)
      }
    }
  }
}
</script>
