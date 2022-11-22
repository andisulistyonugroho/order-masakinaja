<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
    :overlay="false"
    fullscreen
  >
    <v-card tile>
      <v-toolbar dark flat max-height="54" color="primary">
        Detail order: {{ selecteddate|toDayDate }}
        <v-spacer />
        <v-btn icon small @click="$emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card-text style="height:500px">
        <div class="font-weight-bold">
          Menu:
        </div>
        <span v-if="todaysmenu && todaysmenu.cooked_menus" style="white-space: pre-line">{{ todaysmenu.cooked_menus.details }}</span>
        <span v-else>belum diinput</span>
        <v-divider class="mt-2 pb-2" />
        <div v-for="order in orderindate" :key="order.id">
          <div class="font-weight-bold primary--text">
            {{ order.childrens.call_name }}
          </div>
          <div>
            {{ order.notes }}
          </div>
          <div class="d-flex pt-2">
            <v-spacer />
            <v-btn
              color="primary"
              small
              depressed
              text
              rounded
              @click="openCancelingNotes(order)"
            >
              batalkan order
            </v-btn>
            <v-btn color="primary" small depressed rounded @click="openEditNotes(order)">
              edit catatan
            </v-btn>
          </div>
          <v-divider class="mt-2 pb-2" />
        </div>
        <v-btn
          v-if="canAddNewOrder"
          block
          color="primary"
          outlined
          rounded
          @click="addOrderD = true"
        >
          tambah pesanan
        </v-btn>
      </v-card-text>
    </v-card>
    <LazyOrderDetailEditNotes
      :dialog="editNoteD"
      :orderdetail="editedOrderDetail"
      @closeit="closeEditNoteD"
    />
    <LazyOrderDetailAddOrder
      v-if="addOrderD"
      :dialog="addOrderD"
      :selecteddate="selecteddate"
      :orderindate="orderindate"
      :santris="santris"
      @closeit="closeEditNoteD"
    />
  </v-dialog>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
import { mapState } from 'vuex'
export default {
  props: {
    dialog: { type: Boolean, default: false },
    selecteddate: { type: String, default: '' },
    santris: { type: Array, default: null },
    todaysmenu: { type: Object, default: null },
    orderindate: { type: Array, default: null }
  },
  data () {
    return {
      childIds: [],
      editNoteD: false,
      editedOrderDetail: {
        order_id: null,
        order_notes: null,
        call_name: null
      },
      addOrderD: false
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.id
    }),
    santries () {
      const clones = cloneDeep(this.santris)
      if (this.orderindate.length > 0) {
        for (let i = 0; i < this.orderindate.length; i++) {
          const index = clones.findIndex(obj => obj.id === this.orderindate[i].children_id)
          clones[index].notes = this.orderindate[i].notes
          clones[index].order_id = this.orderindate[i].id
        }
      }
      return clones
    },
    editedChildName () {
      return this.editedOrderId ? this.orderindate.find(obj => obj.id === this.editedOrderId).childrens.call_name : ''
    },
    canAddNewOrder () {
      const lastchance = this.$dayjs(this.selecteddate).startOf('date').add(7, 'hour')
      const thistime = this.$dayjs()

      return thistime.isBefore(lastchance) && this.santries.length > this.orderindate.length
    }
  },
  watch: {
    orderindate () {
      this.childIds = this.orderindate.length > 0 ? this.orderindate.map(obj => obj.children_id) : []
    }
  },
  methods: {
    checkSantri (id, orderId) {
      if (this.childIds.includes(id) === false) {
        this.childIds.push(id)
      } else {
        if (orderId) {
          alert('Anda yakin menghapus pesanan ini?')
        }
        this.$store.dispatch('menu/removeArray', { arr: this.childIds, search: id })
      }
    },
    openEditNotes (input) {
      const lastchance = this.$dayjs(this.selecteddate).startOf('date').add(7, 'hour')
      const thistime = this.$dayjs()
      if (thistime.isBefore(lastchance)) {
        this.editedOrderDetail = {
          order_id: input.id,
          order_notes: input.notes,
          call_name: input.childrens.call_name
        }
        this.editNoteD = true
      } else {
        alert('Afwan, edit catatan terakhir pukul 7:00 pagi')
      }
    },
    openCancelingNotes (input) {
      const lastchance = this.$dayjs(this.selecteddate).startOf('date').add(7, 'hour')
      const thistime = this.$dayjs()
      if (thistime.isBefore(lastchance)) {
        this.editedOrderDetail = {
          order_id: input.id,
          order_notes: 'Batal karena',
          call_name: input.childrens.call_name,
          is_active: false
        }
        this.editNoteD = true
      } else {
        alert('Afwan, pembatalan terakhir pukul 7:00 pagi')
      }
    },
    closeEditNoteD () {
      this.editedOrderDetail = {
        order_id: null,
        order_notes: null,
        call_name: null
      }
      this.editNoteD = false
      this.addOrderD = false
      this.$emit('refreshorderdetail', this.selecteddate)
    }
  }
}
</script>
