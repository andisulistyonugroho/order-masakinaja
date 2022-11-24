<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
    :overlay="false"
  >
    <v-card tile>
      <v-toolbar dark flat max-height="54" color="primary">
        @Menu: {{ selecteddate|toDayDate }}
        <v-spacer />
        <v-btn icon small @click="$emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card-text style="height:500px">
        <div v-if="todaysmenu && todaysmenu.cooked_menus" class="font-weight-bold pt-5">
          {{ todaysmenu.cooked_menus.name }}
          <span style="white-space: pre-line">
            {{ todaysmenu.cooked_menus.details }}
          </span>
        </div>
        <div v-else class="pt-5">
          belum diinput
        </div>
        <v-divider class="mt-2 pb-2" />
        <template v-if="isAllowed">
          <v-form>
            <v-select
              v-model="cooked_menu_id"
              :items="allcooking"
              label="Ganti dengan menu lain"
              item-text="name"
              item-value="id"
            />
            <span style="white-space: pre-line">{{ selectedMenu.details }}</span>
          </v-form>
          <v-btn
            :disabled="!cooked_menu_id"
            rounded
            depressed
            block
            class="mt-2"
            @click="doClickChange"
          >
            ganti menu
          </v-btn>
        </template>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  props: {
    dialog: { type: Boolean, default: false },
    selecteddate: { type: String, default: '' },
    todaysmenu: { type: Object, default: null },
    allcooking: { type: Array, default: null }
  },
  data () {
    return {
      cooked_menu_id: null
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.id
    }),
    selectedMenu () {
      return this.allcooking.find(obj => obj.id === this.cooked_menu_id) ?? {}
    },
    isAllowed () {
      const lastchance = this.$dayjs(this.selecteddate).startOf('date').add(7, 'hour')
      const thistime = this.$dayjs()
      return thistime.isBefore(lastchance)
    }
  },
  methods: {
    doClickChange: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        if (this.todaysmenu && this.todaysmenu.cooked_menus) {
          await this.$store.dispatch('cooking/updateDailyMenu', {
            id: this.todaysmenu.id,
            cooked_menu_id: this.cooked_menu_id
          })
        } else {
          await this.$store.dispatch('cooking/addDailyMenu', {
            menu_date: this.selecteddate,
            cooked_menu_id: this.cooked_menu_id
          })
        }
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'Berhasil'
        })
        this.$emit('closeit')
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
