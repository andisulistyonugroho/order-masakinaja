<template>
  <section :class="$vuetify.breakpoint.mobile ? 'pt-0' : 'pa-3'">
    <v-card outlined flat>
      <v-card-text>
        <div class="d-flex text-capitalize pb-5">
          <span class="title">menu dasar</span>
          <v-spacer />
          <v-btn v-show="!openForm" x-small color="primary" depressed @click="openForm = true">
            add menu
          </v-btn>
        </div>
        <div v-show="openForm" class="pb-5">
          <v-form ref="form" lazy-validation>
            <v-text-field
              v-model="name"
              :rules="[v=>!!v || 'Data ini harus diisi!']"
              label="Nama menu*"
            />
            <v-textarea
              v-model="details"
              :rules="[v=>!!v || 'Data ini harus diisi!']"
              label="Detail menu*"
              rows="4"
              auto-grow
            />
            <div class="d-flex">
              <v-spacer />
              <v-btn color="primary" text @click="closeForm()">
                batal
              </v-btn>
              <v-btn color="primary" depressed rounded @click="doCreate()">
                simpan
              </v-btn>
            </div>
          </v-form>
        </div>
        <v-data-iterator
          :items="items"
          hide-default-footer
        >
          <template #default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.name"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card>
                  <v-card-text>
                    <div class="font-weight-bold">
                      {{ item.name }}
                    </div>
                    <span style="white-space: pre-line">{{ item.details }}</span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      openForm: false,
      name: null,
      details: null
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      items: state => state.cooking.all
    })
  },
  async created () {
    this.$nuxt.$emit('TITLE_BAR', 'Pemesanan Katering')
    this.$nuxt.$emit('WAIT_DIALOG', true)
    await this.$store.dispatch('cooking/getAll')
    this.$nuxt.$emit('WAIT_DIALOG', false)
  },
  methods: {
    doCreate: debounce(async function () {
      try {
        if (this.$refs.form.validate()) {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          await this.$store.dispatch('cooking/addCookedMeal', {
            name: this.name, details: this.details
          })
          this.openForm = false
          this.$nuxt.$emit('WAIT_DIALOG', false)
        }
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    }, 1000, { leading: true, trailing: false }),
    closeForm () {
      this.$refs.form.reset()
      this.openForm = false
    }
  }
}
</script>
