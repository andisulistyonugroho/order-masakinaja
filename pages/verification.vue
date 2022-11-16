<template>
  <v-app id="login">
    <v-main>
      <v-container fill-height fluid>
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="12" sm="8" md="4">
            <v-card outlined>
              <v-card-title
                class="justify-center headline"
              >
                <v-img
                  lazy-src="/logo.png"
                  src="/logo.png"
                  alt="MASAKINAJA"
                  max-height="133"
                  contain
                  @click="$router.push('/')"
                />
              </v-card-title>
              <v-card-text class="text-center overline">
                Verifikasi dengan nomer WA &amp; kode token
              </v-card-text>
              <v-card-text class="px-4 pt-5">
                <v-form ref="form">
                  <v-text-field
                    id="wa"
                    v-model="mobile"
                    :rules="[
                      (v) => !!v || 'WA is required'
                    ]"
                    label="Nomer WA"
                    placeholder="+628xxxx"
                    persistent-placeholder
                    type="text"
                    outlined
                    required
                  />
                  <v-text-field
                    id="verificationToken"
                    v-model="token"
                    :rules="[
                      (v) => !!v || 'Kode token is required'
                    ]"
                    label="Kode Token"
                    placeholder="*$30asdf/.@##akd"
                    persistent-placeholder
                    outlined
                    required
                    data-cy="verification-token"
                    @keypress.13.prevent="validateBeforeSubmit"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions class="px-4 pt-0">
                <v-btn
                  id="btnLogin"
                  block
                  large
                  color="primary"
                  type="submit"
                  dark
                  data-cy="submit-verification"
                  @click="validateBeforeSubmit"
                >
                  verifikasi
                </v-btn>
              </v-card-actions>
              <v-card-text>
                <div class="text-center">
                  Belum punya akun?
                  <nuxt-link to="/register">
                    daftar sekarang
                  </nuxt-link>
                </div>
                <div class="text-center">
                  Sudah punya akun?
                  <nuxt-link to="/login">
                    login di sini
                  </nuxt-link>
                </div>
              </v-card-text>
              <v-card-text class="greylight">
                <div class="text-center">
                  Lupa kode token
                  <nuxt-link to="/forgetpassword">
                    Request ulang
                  </nuxt-link>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  layout: 'login',
  data () {
    return {
      mobile: this.$route.query.wa,
      token: null
    }
  },
  methods: {
    ...mapActions({
      loginAct: 'user/loginAct'
    }),
    validateBeforeSubmit: debounce(async function () {
      try {
        if (this.$refs.form.validate()) {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          await this.$store.dispatch('user/verifyOtp', {
            mobile: this.mobile,
            token: this.token
          })
          await this.loginAct({
            username: this.mobile,
            password: this.token
          })
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'success',
            message: 'VERIFIKASI SUKSES, SILAKAN LOGIN'
          })
          this.$router.push('/')
        }
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }, 3000, { leading: true, trailing: false })
  }
}
</script>
