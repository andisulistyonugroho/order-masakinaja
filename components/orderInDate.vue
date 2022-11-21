<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
    :overlay="false"
    fullscreen
  >
    <v-card tile>
      <v-toolbar flat max-height="54">
        {{ selecteddate|toDayDate }}
        <v-spacer />
        <v-btn icon small @click="$emit('closeit')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card-text style="height:500px">
        <span class="font-weight-bold">Menu</span>
        <ul>
          <li>Cah kangkung</li>
          <li>Baso tumis sambel ijo</li>
          <li>Buah</li>
        </ul>
        <v-divider />
        <div v-for="santri in santries" :key="santri.id">
          <v-chip
            class="d-flex pt-2 pl-1"
            color="transparent"
            label
            @click="checkSantri(santri.id)"
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
      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" rounded @click="childIds=[]">
          batal
        </v-btn>
        <v-btn color="primary" rounded depressed>
          pesan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import cloneDeep from 'lodash.clonedeep'
export default {
  props: {
    dialog: { type: Boolean, default: false },
    selecteddate: { type: String, default: '' },
    santris: { type: Array, default: null }
  },
  data () {
    return {
      childIds: []
    }
  },
  computed: {
    santries () {
      return cloneDeep(this.santris)
    }
  },
  created () {
    console.log('order in date')
  },
  methods: {
    checkSantri (id) {
      if (this.childIds.includes(id) === false) {
        this.childIds.push(id)
      } else {
        this.$store.dispatch('menu/removeArray', { arr: this.childIds, search: id })
      }
    }
  }
}
</script>
