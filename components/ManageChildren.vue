<template>
  <v-dialog
    :value="dialog"
    scrollable
    fullscreen
    persistent
    :overlay="false"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card tile>
      <v-toolbar color="primary" dark flat max-height="54">
        Data Santri
        <v-spacer />
        <v-btn icon small @click="$emit('close-it')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text v-show="manageData" class="pt-5">
        <v-form ref="formManageChildren" lazy-validation>
          <v-select
            v-model="gender"
            :items="['Ikhwan','Akhwat']"
            label="Ikhwan/Akhwat*"
          />
          <v-text-field
            v-model="fullName"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            label="Nama Lengkap*"
          />
          <v-text-field
            v-model="callName"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            label="Nama Panggilan*"
          />
          <v-select
            v-model="level"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            :items="levels"
            label="Tingkat*"
          />
          <v-select
            v-model="classRoom"
            :rules="[v => !!v || 'Data ini tidak boleh kosong!']"
            :items="classRooms"
            label="Kelas*"
          />
          <v-textarea
            v-model="notes"
            label="Alergi/Catatan Lain"
            placeholder="Tidak ada alergi"
            persistent-placeholder
          />
          <v-checkbox
            v-model="checkbox"
            :rules="[v => !!v || 'Harus dicentang untuk melanjutkan!']"
            label="Data ini sudah benar"
            required
          />
        </v-form>
        <div class="d-flex">
          <v-spacer />
          <v-btn color="primary" text rounded @click="manageData = false">
            batal
          </v-btn>
          <v-btn color="primary" depressed rounded @click="doSave">
            simpan
          </v-btn>
        </div>
      </v-card-text>
      <v-card-text v-show="!manageData" class="pt-5">
        <v-sheet v-for="child in childrens" :key="child.id">
          <div class="font-weight-bold">
            {{ child.call_name }} - {{ child.full_name }}
          </div>
          <div>{{ child.level }} {{ child.class_room }}</div>
          <div>{{ child.notes }}</div>
          <div class="d-flex">
            <v-spacer />
            <v-btn x-small color="primary" depressed rounded>
              edit
            </v-btn>
          </div>
          <v-divider class="my-5" />
        </v-sheet>
        <v-fab-transition>
          <v-btn
            color="primary"
            dark
            fixed
            depressed
            bottom
            right
            fab
            @click="manageData = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  props: {
    dialog: { type: Boolean, default: false }
  },
  data () {
    return {
      manageData: false,
      checkbox: false,
      levels: [
        'KA 1',
        'KA 2',
        'KA 3',
        'Qonuni 1',
        'Qonuni 2',
        'Qonuni 3',
        'Qonuni 4'
      ],
      level: null,
      classRoom: null,
      fullName: null,
      callName: null,
      gender: null,
      notes: null
    }
  },
  computed: {
    ...mapState({
      userid: state => state.user.id,
      childrens: state => state.children.mine
    }),
    classRooms () {
      let value = []
      if (this.level) {
        if (this.level.includes('KA')) {
          value = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        } else if (this.level.includes('Qonuni')) {
          value = ['Ikhwan', 'Akhwat']
        }
      }
      return value
    }
  },
  async created () {
    await this.getChildrens()
  },
  methods: {
    doSave: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        if (this.$refs.formManageChildren.validate()) {
          const { data, error } = await this.$supabase
            .from('childrens')
            .insert([{
              parent_id: this.userid,
              full_name: this.fullName,
              call_name: this.callName,
              level: this.level,
              class_room: this.classRoom,
              gender: this.gender,
              notes: this.notes,
              managed_by: this.userid
            }])
          if (error) { throw error }
          await this.getChildrens(data)
          this.$refs.formManageChildren.reset()
          this.manageData = false
        }
        this.$nuxt.$emit('WAIT_DIALOG', false)
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }, 1000, { leading: true, trailing: false }),
    async getChildrens () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('children/getChildrens')
        this.$nuxt.$emit('WAIT_DIALOG', false)
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }
  }
}
</script>
