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
                  height="80"
                  contain
                  @click="$router.push('/')"
                />
              </v-card-title>
              <v-card-text class="text-center overline pb-2">
                buat akun untuk mengatur pemesanan
              </v-card-text>
              <v-card-text class="px-4 py-0">
                <v-form
                  ref="form"
                  lazy-validation
                >
                  <v-text-field
                    v-model.trim="formData.name"
                    :rules="[
                      (v) => !!v || 'Nama Walisantri harus diisi'
                    ]"
                    label="Nama Walisantri*"
                    placeholder="Nama"
                    persistent-placeholder
                    type="text"
                    outlined
                    required
                    data-cy="name"
                  />

                  <v-text-field
                    v-model.trim="formData.wa"
                    :rules="[
                      (v) => !!v || 'Nomor WhatsApp harus diisi',
                      (v) => Number.isInteger(Number(v)) || 'Nomer WA tidak valid',
                      (v) =>
                        (v && v.length >= 10) ||
                        'Nomer tidak boleh kurang dari 10 karakter'
                    ]"
                    label="Nomor WhatsApp*"
                    placeholder="0812345678910"
                    persistent-placeholder
                    type="text"
                    outlined
                    required
                    data-cy="wa"
                  />

                  <v-checkbox v-model="checkbox" data-cy="agreement-btn" :rules="[v => !!v || 'Centang untuk melanjutkan']" required class="py-0 my-0">
                    <template #label>
                      <div>
                        Data yang saya isi sudah benar
                      </div>
                    </template>
                  </v-checkbox>
                </v-form>
              </v-card-text>
              <v-card-actions class="px-4 py-0">
                <v-btn
                  id="btnLogin"
                  block
                  large
                  color="primary"
                  type="submit"
                  dark
                  data-cy="register-btn"
                  @click="submitForm"
                >
                  daftar
                </v-btn>
              </v-card-actions>
              <v-card-text>
                <div class="text-center">
                  Sudah punya akun?
                  <nuxt-link to="/login">
                    login sekarang
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
import { mapActions, mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  layout: 'login',
  data () {
    return {
      saveState: {
        submitting: false,
        showWaConfirmation: false
      },
      formData: {
        name: '',
        wa: ''
      },
      waVerification: {
        loading: false
      },
      menu: false,
      activePicker: null,
      checkbox: false
    }
  },
  computed: {
    ...mapState({
      referrer: state => state.customer.referrer
    })
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  methods: {
    ...mapActions({
      registerCustomer: 'user/registerCustomer',
      loginAct: 'user/loginAct'
    }),
    submitForm: debounce(async function () {
      try {
        if (this.$refs.form.validate()) {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          const { name, wa } = this.formData
          const request = {
            email: `${wa}@masakinaja.com`,
            password: `${wa}-istaiddu`,
            full_name: name,
            wa_number: wa
          }
          await this.registerCustomer(request)
          await this.loginAct({
            email: `${wa}@masakinaja.com`,
            password: `${wa}-istaiddu`
          })
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'success',
            message: 'Kode verifikasi kami kirimkan ke nomer WA anda'
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
    }, 1000, { leading: true, trailing: false })
  }
}
</script>
