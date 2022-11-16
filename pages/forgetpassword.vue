<template>
  <v-app id="forgetpassword">
    <v-main>
      <v-container fluid fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="pa-3">
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
                reset password
              </v-card-text>
              <v-card-text class="text-center pa-0 caption">
                <template v-if="step === 1">
                  Kami akan mengirimkan kode reset<br>untuk membuat password baru ke nomer WA yang telah anda daftarkan.
                </template>
                <template v-else-if="step === 2">
                  Masukkan kode reset yang kami kirimkan ke WA anda untuk membuat password baru
                </template>
              </v-card-text>
              <v-card-text class="px-0 pt-5">
                <v-form ref="form">
                  <template v-if="step === 1">
                    <v-text-field
                      v-model="formData.username"
                      label="Username"
                      placeholder="0812xxxxx"
                      persistent-placeholder
                      :rules="emailRules"
                      outlined
                      required
                    />
                  </template>
                  <template v-else-if="step === 2">
                    <v-text-field
                      v-model="formData.password"
                      :append-icon="showp ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :rules="[v => !!v || 'Password is required', v => (v && v.length >= 6) || 'Password cannot be less than 6 characters']"
                      :type="showp ? 'text' : 'password'"
                      label="Password Baru"
                      hint="At least 6 characters"
                      class="input-group--focused"
                      outlined
                      required
                      @click:append="showp = !showp"
                    />
                    <v-text-field
                      v-model="formData.veToken"
                      label="Kode Reset"
                      :rules="[v => !!v || 'kode reset is required']"
                      outlined
                      required
                    />
                  </template>
                </v-form>
              </v-card-text>
              <v-card-actions class="px-0">
                <v-layout column>
                  <v-flex>
                    <v-btn
                      block
                      x-large
                      color="primary"
                      :loading="loading"
                      @click="validateBeforeSubmit"
                    >
                      <template v-if="step === 1">
                        kirim kode reset
                      </template>
                      <template v-else-if="step === 2">
                        ganti password
                      </template>
                    </v-btn>
                  </v-flex>
                  <v-flex v-if="step === 1" class="text-center pt-5">
                    atau<br><br>
                    <v-btn text class="body-2" color="info" @click="step = 2">
                      saya sudah punya kode reset
                    </v-btn>
                  </v-flex>
                  <v-flex pt-5>
                    <div class="caption text-center">
                      Kembali ke halaman
                      <nuxt-link to="/login">
                        login
                      </nuxt-link>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import debounce from 'lodash.debounce'
export default {
  layout: 'login',
  data: () => ({
    showp: false,
    step: 1,
    loading: false,
    timeout: 3000,
    formData: {
      username: null,
      password: null,
      veToken: null
    },
    emailRules: [
      v => !!v || 'Username is required'
    ]
  }),
  mounted () {
  },
  methods: {
    validateBeforeSubmit: debounce(async function () {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$refs.form.resetValidation()
        if (this.step === 1) {
          await this.doRequestReset()
        } else if (this.step === 2) {
          await this.doNewPassword()
        }
      }
    }, 5000, { leading: true, trailing: false }),
    async doRequestReset () {
      try {
        await this.$axios.post('/Users/resetPasswordRequestUsername', {
          wanumber: this.formData.username
        })
        this.$refs.form.reset()
        this.step = 2
        this.loading = false
      } catch (error) {
        this.$nuxt.$emit('EAT_SNACKBAR', { view: true, color: 'error', message: error })
        this.loading = false
      }
    },
    async doNewPassword () {
      try {
        await this.$axios.post(`/Users/reset-password?access_token=${this.formData.veToken}`, {
          newPassword: this.formData.password
        })
        this.$refs.form.reset()
        this.loading = false
        this.$nuxt.$emit('EAT_SNACKBAR', { view: true, color: 'success', message: 'PASSWORD BARU BERHASIL DISIMPAN, SILAKAN LOGIN' })
        this.$router.push('/login')
      } catch (error) {
        this.$nuxt.$emit('EAT_SNACKBAR', { view: true, color: 'error', message: error })
        this.loading = false
      }
    }
  }
}
</script>
