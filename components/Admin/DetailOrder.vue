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
        @Detail order: {{ selecteddate|toDayDate }}
        <v-spacer />
        <v-btn icon small @click="$emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card-text style="height:500px">
        <div class="font-weight-bold">
          Menu {{ tab }}:
        </div>
        <span v-if="todaysmenu && todaysmenu.cooked_menus" style="white-space: pre-line">{{ todaysmenu.cooked_menus.details }}</span>
        <span v-else>belum diinput</span>
        <v-divider class="mt-2 pb-2" />
        <v-select
          v-model="tab"
          :items="items"
          label="Group"
        />
        <template v-if="orderInGroup.length > 0">
          <div v-for="order in orderInGroup" :key="order.id">
            <div class="font-weight-bold primary--text">
              {{ order.childrens.call_name }}
              - {{ order.childrens.full_name }}
            </div>
            <div>
              {{ order.childrens.gender }}<br>
              {{ order.childrens.level }}{{ order.childrens.class_room }}
            </div>
            <div>
              {{ order.notes }}
            </div>
            <v-divider class="mt-2 pb-2" />
          </div>
        </template>
        <div v-else>
          Tidak ada pesanan
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    dialog: { type: Boolean, default: false },
    selecteddate: { type: String, default: '' },
    todaysmenu: { type: Object, default: null },
    orderindate: { type: Array, default: null }
  },
  data () {
    return {
      tab: 0,
      items: [
        { value: 0, text: 'Qonuni Ikhwan' },
        { value: 1, text: 'Qonuni Akhwat' },
        { value: 2, text: 'KA Ikhwan' },
        { value: 3, text: 'KA Akhwat' }
      ]
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.id
    }),
    orderInGroup () {
      return this.getOrderByGroup()
    }
  },
  methods: {
    getOrderByGroup () {
      let result = []
      if (this.tab === 0) {
        result = this.orderindate.filter(obj => obj.childrens.gender === 'Ikhwan' && obj.childrens.level.includes('Qonuni'))
      } else if (this.tab === 1) {
        result = this.orderindate.filter(obj => obj.childrens.gender === 'Akhwat' && obj.childrens.level.includes('Qonuni'))
      } else if (this.tab === 2) {
        result = this.orderindate.filter(obj => obj.childrens.gender === 'Ikhwan' && obj.childrens.level.includes('KA'))
      } else if (this.tab === 3) {
        result = this.orderindate.filter(obj => obj.childrens.gender === 'Akhwat' && obj.childrens.level.includes('KA'))
      }
      return result
    }
  }
}
</script>
