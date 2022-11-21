<template>
  <v-dialog
    :value="dialog"
    scrollable
    fullscreen
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card tile>
      <v-toolbar color="primary" dark flat max-height="54">
        Data Santri
        <v-spacer />
        <v-btn icon small @click="$emit('close-it')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text v-show="manageData">
        <v-form ref="formManageChildren" lazy-validation>
          <v-select
            v-model="gender"
            :items="['Ikhwan','Akhwat']"
            label="Ikhwan/Akhwat*"
          />
          <v-text-field
            v-model="fullName"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            label="Nama Lengkap*"
          />
          <v-text-field
            v-model="callName"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            label="Nama Panggilan*"
          />
          <v-select
            v-model="level"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            :items="levels"
            label="Tingkat*"
          />
          <v-select
            v-model="classRoom"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            :items="classRooms"
            label="Kelas*"
          />
          <v-checkbox
            v-model="checkbox"
            :rules="[v => !!v || 'Harus dicentang untuk melanjutkan!']"
            label="Data ini sudah benar"
            required
          />
        </v-form>
        <div class="d-flex">
          <v-spacer />
          <v-btn color="primary" text rounded @click="manageData = false">
            batal
          </v-btn>
          <v-btn color="primary" depressed rounded @click="doEditPassword">
            simpan
          </v-btn>
        </div>
      </v-card-text>
      <v-card-text v-show="!manageData">
        <v-fab-transition>
          <v-btn
            color="primary"
            dark
            fixed
            depressed
            bottom
            right
            fab
            @click="manageData = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-text>
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
      manageData: false,
      checkbox: false,
      levels: [
        'KA 1',
        'KA 2',
        'KA 3',
        'Qonuni 1',
        'Qonuni 2',
        'Qonuni 3',
        'Qonuni 4'
      ],
      level: null,
      classRoom: null,
      fullName: null,
      callName: null,
      gender: null,
      notes: null
    }
  },
  computed: {
    classRooms () {
      let value = []
      if (this.level) {
        if (this.level.includes('KA')) {
          value = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        } else if (this.level.includes('Qonuni')) {
          value = ['Ikhwan', 'Akhwat']
        }
      }
      return value
    }
  },
  watch: {
    dialog (val) {
      if (!val) {
        this.$refs.formManageChildren.reset()
      }
    }
  },
  methods: {
    doEditPassword: debounce(function () {
      if (this.$refs.formManageChildren.validate()) {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        this.$axios.post('/Users/change-password', {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }).then((response) => {
          this.$refs.formManageChildren.reset()
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
