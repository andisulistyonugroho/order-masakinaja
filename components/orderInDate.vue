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
        Order baru: {{ selecteddate|toDayDate }}
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
        <v-divider />
        <div v-for="santri in santries" :key="santri.id">
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
        </div>
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
    todaysmenu: { type: Object, default: null }
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
      return cloneDeep(this.santris)
    }
  },
  methods: {
    checkSantri (id, orderId) {
      if (this.childIds.includes(id) === false) {
        this.childIds.push(id)
      } else {
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
            cooked_menus_id: this.todaysmenu.id,
            notes: santri.notes,
            parent_id: this.userid
          })
        }
        await this.$store.dispatch('order/addOrder', arrayInput)
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
