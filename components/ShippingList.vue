<template>
  <v-dialog
    :value="dialog"
    scrollable
    fullscreen
    persistent
    :overlay="false"
    transition="dialog-transition"
  >
    <v-card tile>
      <v-toolbar color="primary" dark max-height="60">
        <v-toolbar-title>
          List Shipping Address
        </v-toolbar-title>
        <v-spacer />
        <v-btn dark text @click="$emit('closeList')">
          tutup
        </v-btn>
      </v-toolbar>
      <v-card-title primary-title />
      <v-card-text>
        <v-btn
          color="primary"
          fab
          absolute
          bottom
          right
          class="mb-10"
          @click="dialogAddEdit = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-row>
          <v-col v-for="(data, index) in shippinglists" :key="data.id" cols="12" sm="6" md="4">
            <v-card>
              <v-toolbar max-height="60" dense flat>
                <v-toolbar-title>
                  Alamat {{ index + 1 }}
                </v-toolbar-title>
                <v-spacer />
                <v-btn dark text @click="populateData(data); dialogAddEdit = true">
                  <v-icon color="primary">
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    Nama Penerima :
                  </v-col>
                  <v-col cols="6">
                    {{ data.name }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    Nomor Kontak :
                  </v-col>
                  <v-col cols="6">
                    {{ data.mobile }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    Alamat :
                  </v-col>
                  <v-col cols="6">
                    {{ data.address }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    Kecamatan :
                  </v-col>
                  <v-col cols="6">
                    {{ data.District.name }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    Kota/Kabupaten
                  </v-col>
                  <v-col cols="6">
                    {{ data.City.name }}
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    Propinsi
                  </v-col>
                  <v-col cols="6">
                    {{ data.Province.name }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-dialog
        v-model="dialogAddEdit"
        scrollable
        persistent
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title primary-title>
            {{ editId === 0 ? 'Tambah Alamat' : 'Edit Alamat' }}
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                v-model="formData.name"
                label="Nama Penerima"
                data-cy="form-name"
                :rules="[
                  (v) => !!v || 'Nama penerima tidak boleh kosong'
                ]"
              />
              <v-text-field
                v-model="formData.mobile"
                label="Nomor Penerima"
                data-cy="form-mobile"
                :rules="[
                  (v) => !!v || 'Nomor penerima tidak boleh kosong'
                ]"
              />
              <v-textarea
                v-model="formData.address"
                label="Alamat Penerima"
                data-cy="form-address"
                :rules="[
                  (v) => !!v || 'Nomor penerima tidak boleh kosong'
                ]"
              />
              <v-select
                v-model="formData.provinceId"
                :items="province"
                label="Propinsi"
                data-cy="form-province"
                item-text="name"
                item-value="id"
                :rules="[
                  v => !!v || 'Propinsi harus dipilih'
                ]"
              />
              <v-select
                v-model="formData.cityId"
                :items="city"
                label="Kota"
                data-cy="form-city"
                item-text="name"
                item-value="id"
                :rules="[
                  v => !!v || 'Kota harus dipilih'
                ]"
              />
              <v-select
                v-model="formData.districtId"
                :items="district"
                label="Kecamatan"
                data-cy="form-district"
                item-text="name"
                item-value="id"
                :rules="[
                  v => !!v || 'Kecamatan harus dipilih'
                ]"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error" @click="closeDialog()">
              batal
            </v-btn>
            <v-btn color="success" @click="submitData()">
              submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      dialogAddEdit: false,
      editId: 0,
      formData: {
        name: null,
        mobile: null,
        address: null,
        provinceId: null,
        cityId: null,
        districtId: null
      }
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      customerData: state => state.user.profile.meAsCustomer,
      province: state => state.customer.province,
      shippinglists: state => state.user.profile.meAsCustomer.shippingAddresses
    }),
    city () {
      return this.province && this.formData.provinceId ? this.province.find(obj => obj.id === this.formData.provinceId).city : []
    },
    district () {
      return this.city.length > 0 && this.formData.cityId ? this.city.find(obj => obj.id === this.formData.cityId).district : []
    }
  },
  created () {
    this.$store.dispatch('customer/getProvince')
  },
  methods: {
    closeDialog () {
      this.editId = 0
      this.formData.customerId = 0
      this.formData.name = null
      this.formData.mobile = null
      this.formData.address = null
      this.formData.provinceId = null
      this.formData.cityId = null
      this.formData.districtId = null
      this.dialogAddEdit = false
    },
    submitData () {
      if (this.$refs.form.validate()) {
        this.postData()
      }
    },
    async postData () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        const payload = {
          customerId: this.customerData.id,
          ...this.formData
        }
        if (this.editId !== 0) {
          await this.$axios.patch(`/ShippingAddresses/${this.editId}`, payload)
        } else {
          await this.$axios.post('/ShippingAddresses', payload)
        }
        await this.$store.dispatch('user/getMyProfile', this.userId)
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'Data berhasil disimpan'
        })
        this.closeDialog()
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    },
    populateData (data) {
      this.editId = data.id
      this.formData.customerId = data.customerId
      this.formData.name = data.name
      this.formData.address = data.address
      this.formData.mobile = data.mobile
      this.formData.provinceId = data.provinceId
      this.formData.cityId = data.cityId
      this.formData.districtId = data.districtId
      this.dialogAddEdit = data.dialogAddEdit
    }
  }
}
</script>
