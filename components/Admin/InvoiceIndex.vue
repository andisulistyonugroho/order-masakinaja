<template>
  <section :class="$vuetify.breakpoint.mobile ? 'pt-0' : 'pa-3'">
    <v-select
      v-model="tab"
      :items="items"
      label="Status"
      class="px-3"
      append-outer-icon="mdi-filter-variant"
      @click:append-outer="showFilter = !showFilter"
    />
    <v-card v-show="showFilter" flat>
      <v-card-text>
        <v-text-field
          dense
          class="caption"
          label="Cari Invoice ID"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn small color="primary" text depressed>
          batal
        </v-btn>
        <v-btn small color="primary" depressed tile>
          cari
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-list two-line dense outlined>
      <v-list-item-group>
        <v-list-item v-for="row in paymentByStatus" :key="row.id">
          <v-list-item-content @click="openInvoice(row)">
            <v-list-item-title class="text-uppercase">
              inv-{{ row.created_at|toInvoice }}-{{ row.id }}
            </v-list-item-title>
            <v-list-item-subtitle class="primary--text">
              Rp{{ row.amount | toMoney }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="caption">
              {{ row.created_at|toDayDate }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>
              mdi-chevron-right
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <LazyAdminInvoiceDetail
      v-if="invoiceDialog"
      :dialog="invoiceDialog"
      :data="selectedInvoice"
      @closeit="closeIt"
    />
  </section>
</template>
<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      tab: 2,
      items: [
        { value: 1, text: 'Belum Lunas' },
        { value: 2, text: 'Perlu Verifikasi' },
        { value: 3, text: 'Lunas' },
        { value: 4, text: 'Refund' }
      ],
      invoiceDialog: false,
      selectedInvoice: null,
      showFilter: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      paymentByStatus: state => state.payment.paymentByStatus
    })
  },
  watch: {
    async tab (val) {
      await this.getPaymentsByStatus(val)
    }
  },
  async created () {
    await this.$nuxt.$emit('TITLE_BAR', 'Tagihan')
    await this.getPaymentsByStatus(this.tab)
  },
  methods: {
    async getPaymentsByStatus (state) {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        await this.$store.dispatch('payment/getPaymentByStatus', { status: state })
        this.$nuxt.$emit('WAIT_DIALOG', false)
      } catch (error) {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      }
    },
    openInvoice: debounce(function (data) {
      this.invoiceDialog = true
      this.selectedInvoice = data
    }, 1000, { leading: true, trailing: false }),
    async closeIt () {
      this.invoiceDialog = false
      await this.getPaymentsByStatus(this.tab)
    }
  }
}
</script>
