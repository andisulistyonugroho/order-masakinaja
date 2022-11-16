<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        Ganti Password
      </v-card-title>
      <v-card-text>
        <v-form ref="formEditPassword" lazy-validation>
          <v-text-field
            v-model="oldPassword"
            name="oldPassword"
            :rules="[v => !!v || 'Password saat ini tidak boleh kosong!']"
            label="Password Saat Ini"
            :type="showPold ? `text` : `password`"
            :append-icon="showPold ? `mdi-eye-outline` : `mdi-eye-off-outline`"
            @click:append="showPold = !showPold"
          />
          <v-text-field
            v-model="newPassword"
            :rules="[
              (v) => !!v || 'Password baru tidak boleh kosong',
              (v) =>
                (v && v.length >= 6) ||
                'Password tidak boleh kurang dari 6 characters'
            ]"
            label="Password Baru"
            :type="showP ? `text` : `password`"
            :append-icon="showP ? `mdi-eye-outline` : `mdi-eye-off-outline`"
            @click:append="showP = !showP"
          />
          <v-checkbox
            v-model="checkbox"
            :rules="[v => !!v || 'Harus dicentang untuk melanjutkan!']"
            label="Saya sudah simpan password baru di tempat aman"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" text @click="$emit('close-it')">
          cancel
        </v-btn>
        <v-btn color="success" text @click="doEditPassword">
          submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import debounce from 'lodash.debounce'
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      oldPassword: null,
      newPassword: null,
      checkbox: false,
      showP: false,
      showPold: false
    }
  },
  watch: {
    dialog (val) {
      if (!val) {
        this.$refs.formEditPassword.reset()
      }
    }
  },
  methods: {
    doEditPassword: debounce(function () {
      if (this.$refs.formEditPassword.validate()) {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        this.$axios.post('/Users/change-password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }).then((response) => {
          this.$refs.formEditPassword.reset()
          this.$emit('close-it')
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'success',
            message: 'Password berhasil diubah'
          })
        }).catch((error) => {
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'error',
            message: error
          })
        })
      }
    }, 1500, { leading: true, trailing: false })
  }
}
</script>
