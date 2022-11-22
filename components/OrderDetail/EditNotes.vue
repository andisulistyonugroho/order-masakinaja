<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
  >
    <v-card tile>
      <v-card-title>
        Edit Catatan {{ orderdetail.call_name }}
      </v-card-title>
      <v-card-text class="pb-0">
        <v-form ref="form">
          <v-textarea
            v-model="notes"
            outlined
          />
        </v-form>
      </v-card-text>
      <v-btn block color="primary" tile depressed @click="doUpdate()">
        Simpan
      </v-btn>
      <v-btn
        block
        color="primary"
        text
        tile
        @click="closeEditNoteD"
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
    orderdetail: { type: Object, default: null }
  },
  data () {
    return {
      notes: null
    }
  },
  watch: {
    orderdetail (val) {
      if (val) {
        this.notes = val.order_notes
      }
    }
  },
  methods: {
    closeEditNoteD () {
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
        await this.$store.dispatch('order/updateOrder', { id: this.orderdetail.id, notes: this.notes, is_active: false })
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
