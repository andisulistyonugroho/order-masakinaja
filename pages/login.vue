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
                  alt="masakinaja"
                  height="80"
                  width="142"
                  contain
                  @click="$router.push('/')"
                />
              </v-card-title>
              <v-card-text class="text-center overline">
                Login dengan nomer wa &amp; password
              </v-card-text>
              <v-card-text class="px-4 pt-5">
                <v-form ref="form">
                  <v-text-field
                    id="username"
                    v-model="formData.username"
                    :rules="[
                      (v) => !!v || 'Required'
                    ]"
                    label="Nomer WA"
                    placeholder="0812345678910"
                    persistent-placeholder
                    type="text"
                    outlined
                    required
                  />
                  <v-text-field
                    id="password"
                    key="password-input"
                    v-model="formData.password"
                    :rules="[
                      (v) => !!v || 'Required',
                      (v) =>
                        (v && v.length >= 6) ||
                        'Tidak boleh kurang dari 6 karakter'
                    ]"
                    label="Password"
                    placeholder="password"
                    outlined
                    required
                    :append-icon="showP ? `mdi-eye-outline` : `mdi-eye-off-outline`"
                    :type="showP ? `text` : `password`"
                    @keypress.13.prevent="validateBeforeSubmit"
                    @click:append="showP = !showP"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions class="px-4">
                <v-btn
                  id="btnLogin"
                  block
                  large
                  color="primary"
                  type="submit"
                  dark
                  @click="validateBeforeSubmit"
                >
                  login
                </v-btn>
              </v-card-actions>
              <v-card-text>
                <div class="text-center">
                  Belum punya akun?
                  <nuxt-link to="/register">
                    daftar sekarang
                  </nuxt-link>
                </div>
              </v-card-text>
              <v-card-text class="greylight">
                <div class="text-center">
                  Lupa password hubungi admin
                  {{ aphone }}
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
  data: () => ({
    formData: {
      username: null,
      password: null
    },
    pesan: null,
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    showP: false,
    aphone: process.env.ADMINPHONE
  }),
  mounted () {
    // this.$validator.localize('en', this.dictionary)
  },
  methods: {
    ...mapActions({
      loginAct: 'user/loginAct'
    }),
    validateBeforeSubmit: debounce(
      function () {
        if (this.$refs.form.validate()) {
          this.doLogin()
        }
      },
      5000,
      { leading: true, trailing: false }
    ),
    async doLogin () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.loginAct({
          email: `${this.formData.username}@masakinaja.com`,
          password: this.formData.password
        })
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$router.push('/')
      } catch (error) {
        let pesan = ''
        if (error.response) {
          const msg = error.response.data.error.message
            ? error.response.data.error.message
            : null
          pesan = `Mohon cek kembali username dan password anda, ${msg}`
        } else if (error.message) {
          pesan = error.message
        } else {
          pesan = 'Terjadi kesalahan server'
        }
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: pesan
        })
      }
    }
  }
}
</script>
