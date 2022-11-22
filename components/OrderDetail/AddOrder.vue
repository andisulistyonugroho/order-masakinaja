<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
  >
    <v-card tile>
      <v-card-title>
        Tambah Pesanan
      </v-card-title>
      <v-card-text class="pb-0">
        <v-form ref="form">
          <v-select
            v-model="children_id"
            :items="availableSantris"
            label="Nama Santri*"
            :rules="[v => !!v || 'Data ini tidak boleh kosong']"
            item-text="call_name"
            item-value="id"
          >
            <template #selection="data">
              {{ data.item.call_name }}: {{ data.item.full_name }}
            </template>
            <template #item="data">
              {{ data.item.call_name }}: {{ data.item.full_name }}
            </template>
          </v-select>
          <v-textarea
            v-model="notes"
            label="Catatan"
            auto-grow
            rows="2"
          />
        </v-form>
      </v-card-text>
      <v-btn block color="primary" tile depressed @click="doCreate">
        Simpan
      </v-btn>
      <v-btn
        block
        color="primary"
        text
        tile
        @click="closeAddOrderD"
      >
        Tutup
      </v-btn>
    </v-card>
  </v-dialog>
</template>
<script>
import debounce from 'lodash.debounce'
import { mapState } from 'vuex'
export default {
  props: {
    dialog: { type: Boolean, default: false },
    selecteddate: { type: String, default: '' },
    santris: { type: Array, default: null },
    orderindate: { type: Array, default: null }
  },
  data () {
    return {
      notes: null,
      availableSantris: [],
      children_id: null
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.id
    })
  },
  watch: {
    children_id (val) {
      this.notes = val ? this.availableSantris.find(obj => obj.id === val).notes : null
    }
  },
  created () {
    const childrenIds = this.orderindate.map(obj => obj.children_id)
    this.availableSantris = this.santris.filter(obj => !childrenIds.includes(obj.id))
  },
  methods: {
    closeAddOrderD () {
      this.$refs.form.reset()
      this.$emit('closeit')
    },
    doCreate: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        const arrayInput = [{
          children_id: this.children_id,
          order_date: this.selecteddate,
          cooked_menus_id: this.orderindate.cooked_menu_id,
          notes: this.notes,
          parent_id: this.userid
        }]
        await this.$store.dispatch('order/addOrder', arrayInput)
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'Berhasil diupdate'
        })
        this.closeAddOrderD()
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
