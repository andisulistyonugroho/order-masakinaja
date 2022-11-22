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
            :items="availableSantris"
            label="Nama Santri*"
            :rules="[v => !!v || 'Data ini tidak boleh kosong']"
            item-text="call_name"
            item-value="id"
          />
          <v-textarea
            v-model="notes"
            auto-grow
            rows="2"
          />
        </v-form>
      </v-card-text>
      <v-btn block color="primary" tile depressed @click="orderdetail.is_active === false ? doDelete() : doUpdate()">
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
      availableSantris: []
    }
  },
  created () {
    console.log('add orde created')
    const childrenIds = this.orderindate.map(obj => obj.children_id)
    this.availableSantris = this.santris.filter(obj => !childrenIds.includes(obj.id))
    console.log('AVAIL:', this.availableSantris)
  },
  methods: {
    closeAddOrderD () {
      this.$refs.form.reset()
      this.$emit('closeit')
    },
    doUpdate: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('order/updateOrder', { id: this.orderdetail.order_id, notes: this.notes })
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'Berhasil diupdate'
        })
        this.closeEditNoteD()
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }, 1000, { leading: true, trailing: false }),
    doDelete: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('order/updateOrder', { id: this.orderdetail.order_id, notes: this.notes, is_active: false })
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'Berhasil dihapus'
        })
        this.closeEditNoteD()
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
