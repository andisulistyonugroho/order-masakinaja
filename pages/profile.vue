<template>
  <v-container fluid>
    <v-card
      tile
      flat
      color="transparent"
    >
      <v-form
        ref="form"
        lazy-validation
        class="pt-0"
      >
        <v-row>
          <v-col cols="12" class="pb-0 overline">
            Profil
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="py-0"
          >
            <v-text-field
              v-model="fullname"
              :disabled="!onEdit"
              label="Nama Lengkap*"
              placeholder="Nama Lengkap"
              :rules="[
                v => !!v || 'Nama lengkap is required'
              ]"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="py-0"
          >
            <v-text-field
              v-model="mobile"
              disabled
              label="Nomer WA*"
              placeholder="08xxxx"
              :rules="[
                (v) => !!v || 'Nomer WA is required'
              ]"
              type="number"
              hint="Hubungi admin untuk perubahan nomer WA"
              persistent-hint
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="py-0"
          >
            <v-text-field
              v-model="email"
              disabled
              label="Email*"
              placeholder="alamat@email.com"
              hint="Hubungi admin untuk perubahan alamat email"
              persistent-hint
              :rules="[
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
              ]"
            />
          </v-col>
          <v-col cols="12" class="pb-0 overline">
            Data Pribadi &amp; Bank
          </v-col>
          <v-col cols="12" md="6" class="py-0">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="birthDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="birthDate"
                  :disabled="!onEdit"
                  label="Tanggal lahir"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="birthDate"
                :active-picker.sync="activePicker"
                :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                min="1950-01-01"
              >
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="menu = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(birthDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="py-0"
          >
            <v-text-field
              v-model="ktp"
              :disabled="!onEdit"
              label="Nomer KTP*"
              placeholder="Nomer KTP"
              :rules="[
                v => !!v || 'Contact Person is required'
              ]"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="py-0"
          >
            <v-text-field
              v-model="npwp"
              :disabled="!onEdit"
              label="NPWP"
              placeholder="xxxx.xx."
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            class="py-0"
          >
            <v-text-field
              v-model="taxName"
              :disabled="!onEdit"
              label="Nama Wajib Pajak"
              placeholder="Fulanah binti Fulan"
            />
          </v-col>
          <v-col
            cols="12"
            class="py-0"
          >
            <v-textarea
              v-model="taxAddress"
              :disabled="!onEdit"
              label="Alamat*"
              placeholder="Jl. Jalan ke Alun-alun"
              :rules="[
                v => !!v || 'Address is required'
              ]"
              rows="3"
            />
          </v-col>
          <v-col v-if="onEdit" cols="12" class="py-0">
            <v-checkbox
              v-model="sanitycheck"
              :rules="[
                v => !!v || 'check is required'
              ]"
              label="Saya yakin data yang saya input sudah benar."
              class="mt-0"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-card-actions>
        <v-spacer />
        <v-btn v-if="onEdit" text color="error" @click="doCancel">
          batal
        </v-btn>
        <v-btn v-if="onEdit" text color="success" @click="doSave">
          simpan
        </v-btn>
        <v-btn v-if="!onEdit" text block color="error" @click="onEdit = true">
          edit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      recruiterSearchForm: false,
      recruiterSearch: null,
      onEdit: false,
      email: null,
      fullname: null,
      mobile: null,
      taxAddress: null,
      ktp: null,
      npwp: null,
      taxName: null,
      bossProfileId: null,
      bankId: null,
      bankAccountNo: null,
      bankAccountName: null,
      communityId: null,
      recruiterProfileId: null,
      sanitycheck: false,
      recruiterMobile: null,
      recruiterCode: null,
      recruiterName: null,
      birthDate: (new Date(2000, 1, 1)).toISOString().substr(0, 10),
      menu: false,
      activePicker: null
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      supervisor: state => state.customer.supervisor,
      banks: state => state.user.banks,
      communities: state => state.customer.communities
    })
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    }
  },
  async created () {
    this.$nuxt.$emit('TITLE_BAR', 'PROFIL SAYA')
    await this.$store.dispatch('customer/getCommunities')
    await this.$store.dispatch('user/getBanks')
    await this.loadProfile()
  },
  methods: {
    doSave: debounce(async function () {
      try {
        if (this.$refs.form.validate()) {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          // Remember to include all fields, we are using PUT missing fields will be set to null
          await this.$axios.patch(`UserProfiles/${this.profile.id}`, {
            userId: this.userId,
            fullname: this.fullname,
            refCode: this.profile.refCode,
            mobile: this.mobile,
            ktp: this.ktp,
            npwp: this.npwp,
            taxName: this.taxName,
            taxAddress: this.taxAddress,
            joinDate: this.profile.updated_at,
            recruiterProfileId: this.recruiterProfileId,
            createdAt: this.profile.createdAt,
            communityId: this.communityId,
            bossProfileId: this.bossProfileId,
            bankId: this.bankId,
            bankAccountNo: this.bankAccountNo,
            bankAccountName: this.bankAccountName,
            birthDate: this.birthDate
          })
          await this.$store.dispatch('user/getMyProfile', this.userId)
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'success',
            message: 'Data anda berhasil diupdate'
          })
          this.onEdit = false
          this.recruiterSearchForm = false
        }
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }, 1000, { leading: true, trailing: false }),
    loadProfile () {
      this.fullname = this.profile.fullname
      this.email = this.profile.users.email
      this.mobile = this.profile.mobile
      this.taxAddress = this.profile.taxAddress
      this.ktp = this.profile.ktp
      this.npwp = this.profile.npwp
      this.taxName = this.profile.taxName
      this.bossProfileId = this.profile.bossProfileId
      this.bankId = this.profile.bankId
      this.bankAccountNo = this.profile.bankAccountNo
      this.bankAccountName = this.profile.bankAccountName
      this.communityId = this.profile.communityId
      this.recruiterProfileId = this.profile.recruiterProfileId
      this.birthDate = this.profile.birthDate.substr(0, 10)
    },
    doCancel () {
      this.$refs.form.resetValidation()
      this.onEdit = this.recruiterSearchForm = false
      this.loadProfile()
    }
  }
}
</script>
