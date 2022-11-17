<template>
  <v-dialog
    :value="dialog"
    scrollable
    persistent
    :overlay="false"
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
        <div v-for="santri in santris" :key="santri.id">
          <v-chip
            class="d-flex mt-2 pl-1"
            color="transparent"
            label
            @click="checkSantri(santri.id)"
          >
            <v-icon left color="primary">
              {{ childIds.includes(santri.id) ? `mdi-checkbox-marked-outline` : `mdi-checkbox-blank-outline` }}
            </v-icon>
            {{ santri.name }}
          </v-chip>
          <v-text-field
            label="Catatan"
            dense
            placeholder="tidak ada alergi"
            persistent-placeholder
            class="caption pt-3 pb-5"
          />
        </div>
      </v-card-text>
      <v-btn block color="primary" tile depressed>
        pesan
      </v-btn>
      <v-btn text block @click="childIds=[]">
        batal
      </v-btn>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: { type: Boolean, default: false },
    selecteddate: { type: String, default: '' }
  },
  data () {
    return {
      childIds: [],
      santris: [
        { id: 1, name: 'Anak Pertama' },
        { id: 2, name: 'Anak Kedua' },
        { id: 3, name: 'Anak Ketiga' }
      ]
    }
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
