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
        <span v-if="todaysmenu && todaysmenu.cooked_menus" class="caption" style="white-space: pre-line">{{ todaysmenu.cooked_menus.details }}</span>
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
            <v-btn color="primary" x-small depressed text rounded>
              batalkan order
            </v-btn>
            <v-btn color="primary" x-small depressed rounded>
              edit catatan
            </v-btn>
          </div>
          <v-divider class="pb-2" />
        </div>
        <!-- <div v-for="santri in santries" :key="santri.id">
          <v-chip
            class="d-flex pt-2 pl-1"
            color="transparent"
            label
            @click="checkSantri(santri.id,santri.order_id)"
          >
            <v-icon left color="primary">
              {{ childIds.includes(santri.id) ? `mdi-checkbox-marked-outline` : `mdi-checkbox-blank-outline` }}
            </v-icon>
            {{ santri.call_name }}
          </v-chip>
          <v-textarea
            v-show="childIds.includes(santri.id)"
            v-model="santri.notes"
            label="Catatan"
            rows="3"
            dense
            placeholder="tidak ada alergi"
            persistent-placeholder
            class="caption pt-2"
            auto-grow
            outlined
            hide-details
            clearable
          />
        </div> -->
      </v-card-text>
      <v-divider />
      <v-card-actions v-if="childIds.length > 0">
        <v-spacer />
        <v-btn text color="primary" rounded @click="childIds=[]">
          batal
        </v-btn>
        <v-btn color="primary" rounded depressed @click="doOrder">
          pesan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
import debounce from 'lodash.debounce'
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
      childIds: []
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
    doOrder: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        const arrayInput = []
        for (let i = 0; i < this.childIds.length; i++) {
          const santri = this.santries.find(obj => obj.id === this.childIds[i])
          arrayInput.push({
            children_id: this.childIds[i],
            order_date: this.selecteddate,
            cooked_menus_id: this.cookedmenusid,
            notes: santri.notes,
            parent_id: this.userid
          })
        }
        await console.log(arrayInput)
        // await this.$store.dispatch('order/addOrder', arrayInput)
        this.$emit('closeit')
        this.$nuxt.$emit('WAIT_DIALOG', false)
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    })
  }
}
</script>
