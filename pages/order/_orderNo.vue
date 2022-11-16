<template>
  <v-container fluid class="pb-0">
    <div class="font-weight-bold overline">
      Status
    </div>
    <v-row>
      <v-col cols="12" class="pb-0">
        {{ order.status|orderStatus }}
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="5" class="body-2 grey--text text--darken-2">
        Order Note
      </v-col>
      <v-col cols="7" class="body-2 text-right">
        {{ order.orderNote }}
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="5" class="body-2 grey--text text--darken-2">
        Tgl Pembelian
      </v-col>
      <v-col cols="7" class="body-2 text-right">
        {{ order.createdAt|toDateTime }}
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="12" class="body-2 grey--text text--darken-2">
        {{ order.invoices ? order.invoices.invoiceNumber : '' }}
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
    </v-row>
    <div class="font-weight-bold overline">
      Daftar Produk Set
    </div>
    <v-data-iterator
      v-if="order.orderItems"
      :items="order.orderItems"
    >
      <template #default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-text>
                <div class="black--text">
                  {{ item.productSet.name }}
                </div>
                <div class="caption">
                  {{ item.quantity|toMoney }} barang ({{ item.weight|toMoney }} gr)
                </div>
                <div v-if="item.productSet.discount && item.productSet.discount > 0">
                  <span class="caption text--disabled text-decoration-line-through">
                    Rp {{ item.productSet.basePrice|toMoney }}
                  </span>
                  <span class="caption">&nbsp;diskon: Rp {{ item.productSet.discount|toMoney }}</span>
                </div>
                <div class="secondary--text">
                  Rp {{ item.productSet.price|toMoney }}
                </div>
              </v-card-text>
              <v-divider />
              <v-card-subtitle class="pb-0 pt-2 caption">
                Total Harga
              </v-card-subtitle>
              <v-card-text class="secondary--text d-block pb-2">
                Rp {{ item.subtotal|toMoney }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    <v-divider />
    <div class="font-weight-bold overline">
      Detail Pengiriman
    </div>
    <v-row>
      <v-col cols="5" class="body-2 grey--text text--darken-2">
        Kurir Pengiriman
      </v-col>
      <v-col cols="7" class="body-2">
        {{ order.shippingCode }} - {{ order.shippingService }}
      </v-col>
      <v-col cols="5" class="body-2 grey--text text--darken-2">
        No. Resi<input
          id="track-number"
          readonly
          style="width:1px;height:1px;font-color: white;"
          width="1"
          :value="order.trackingNo"
        >
      </v-col>
      <v-col cols="7" class="body-2">
        <span>{{ order.trackingNo }}</span><br>
        <v-chip v-show="order.trackingNo" label class="info" @click="doCheckResi">
          cek status
        </v-chip>
      </v-col>
      <v-col cols="5" class="body-2 grey--text text--darken-2">
        Alamat Pengiriman
      </v-col>
      <v-col cols="7" class="body-2">
        <template v-if="order.shippingAddress">
          {{ order.shippingAddress.name }}<br>
          {{ order.shippingAddress.mobile }}<br>
          {{ order.shippingAddress.address }}, {{ order.shippingAddress.District.name }}<br>
          {{ order.shippingAddress.City.name }}, {{ order.shippingAddress.Province.name }}<br>
          {{ order.shippingAddress.zipcode }}
        </template>
      </v-col>
    </v-row>
    <v-divider />
    <div class="font-weight-bold overline">
      Informasi Pembayaran
    </div>
    <v-row v-if="order.invoices" class="pb-5">
      <v-col cols="5" class="grey--text text--darken-2 body-2">
        Metode Pembayaran
      </v-col>
      <v-col cols="7" class="body-2 text-right">
        {{ order.invoices.bankId ? order.invoices.bank.name : order.invoices.paymentBank.bank.name }}
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="5" class="grey--text text--darken-2 body-2">
        No. Rekening/VA<input
          id="va-number"
          readonly
          style="width:1px;height:1px;font-color: white;"
          :value="order.invoices.vaNumber ? order.invoices.vaNumber : order.invoices.paymentBank.accountNo"
        >
      </v-col>
      <v-col cols="7" class="body-2 text-right">
        <span>{{ order.invoices.vaNumber ? order.invoices.vaNumber : order.invoices.paymentBank.accountNo }}</span>
        <div>an. {{ order.invoices.paymentBank.accountName }}</div>
        <div v-if="order.invoices.vaNumber || order.invoices.paymentBank.accountNo" class="primary--text" @click="doCopyVA">
          salin no rekening/va
        </div>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="7" class="grey--text text--darken-2 body-2 pb-0">
        Total Harga ({{ totalQty|toMoney }} barang)
      </v-col>
      <v-col cols="5" class="body-2 pb-0 text-right">
        Rp {{ order.invoices.totalOrder|toMoney }}
      </v-col>
      <v-col cols="7" class="grey--text text--darken-2 body-2 pb-0">
        Total Ongkir ({{ totalWeight|toMoney }} gr)
      </v-col>
      <v-col cols="5" class="body-2 pb-0 text-right">
        Rp {{ order.invoices.shippingCost|toMoney }}
      </v-col>
      <template v-if="order.promo">
        <v-col cols="12" class="body-2 pb-0">
          KODE PROMO: {{ order.promo.promoCode }}, {{ order.promo.title }}
        </v-col>
        <v-col v-if="!order.invoices.discountId" cols="7" class="grey--text text--darken-2 body-2 pb-0">
          Diskon Produk ({{ order.promo ? `${order.promo.discountPercentage*100} %` : '' }}) + Cashback
        </v-col>
        <v-col v-if="!order.invoices.discountId" cols="5" class="body-2 pb-0 text-right">
          Rp -{{ order.invoices.orderDiscount|toMoney }}
        </v-col>
        <v-col cols="7" class="grey--text text--darken-2 body-2 pb-0">
          Free Ongkir
        </v-col>
        <v-col cols="5" class="body-2 pb-0 text-right">
          Rp -{{ order.invoices.shippingDiscount|toMoney }}
        </v-col>
      </template>
      <template v-if="order.invoices.discountId">
        <v-col cols="12" class="body-2 pb-0">
          <v-chip label color="info">
            Diskon Program: {{ order.invoices.discount.title }}
          </v-chip>
        </v-col>
        <v-col cols="7" class="grey--text text--darken-2 body-2 pb-0">
          {{ order.invoices.discount.description }}
        </v-col>
        <v-col cols="5" class="body-2 pb-0 text-right">
          Rp -{{ order.invoices.orderDiscount|toMoney }}
        </v-col>
      </template>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col cols="7" class="pb-0 font-weight-bold">
        Total Bayar
      </v-col>
      <v-col cols="5" class="secondary--text font-weight-bold pb-0 text-right">
        Rp {{ order.invoices.grandTotal|toMoney }}
      </v-col>
    </v-row>
    <v-row
      v-if="order.status === 1"
    >
      <v-col :class="$vuetify.breakpoint.mobile ? 'pa-0' : 'text-right'">
        <v-btn
          tile
          large
          block
          color="error"
          dark
          @click="openCancelOrderDialog"
        >
          Batalkan Order
        </v-btn>
      </v-col>
      <v-col :class="$vuetify.breakpoint.mobile ? 'pa-0' : 'text-right'">
        <v-btn
          tile
          large
          block
          color="teal"
          dark
          @click="openConfirmPaymentDialog"
        >
          Konfirmasi Pembayaran
        </v-btn>
      </v-col>
      <v-dialog
        v-model="cancelOrderDialog"
        persistent
        max-width="450"
      >
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Batalkan Pesanan</v-toolbar-title>
          </v-toolbar>
          <v-container fluid>
            <v-card-text>
              Anda yakin ingin membatalkan pesanan ?
            </v-card-text>
            <v-card-text>
              <v-form ref="cancelForm">
                <v-text-field
                  v-model="cancelOrderNote"
                  label="Alasan Pembatalan"
                  :rules="[
                    v => !!v || 'Harus menyatakan alasan pembatalan'
                  ]"
                />
              </v-form>
            </v-card-text>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="success"
              text
              @click="doCancelOrder"
            >
              Ya
            </v-btn>
            <v-btn
              color="error"
              text
              @click="cancelOrderDialog = false"
            >
              Tidak
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmFormDialog" persistent max-width="450">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-btn icon dark @click.native="confirmFormDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer />
            <v-toolbar-items>
              <v-btn @click.native="doConfirmPayment">
                Save
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-form ref="paymentConfirmationForm" class="pa-3">
            <div class="overline font-weight-bold">
              konfirmasi pembayaran
            </div>
            <v-select
              v-model="formConfirm.terminalId"
              :items="banks"
              item-text="name"
              item-value="name"
              label="Pembayaran dari"
              :rules="[
                v => !!v || 'Pembayaran dari is required'
              ]"
            />
            <v-text-field
              v-model="formConfirm.refNumber"
              label="Nomer Rekening Saya"
              :rules="[
                v => !!v || 'Nomer Rekening is required'
              ]"
            />
            <v-text-field
              v-model="formConfirm.acquirerId"
              label="Atas Nama"
              :rules="[
                v => !!v || 'Atas nama is required'
              ]"
            />
            <v-text-field
              v-model="formConfirm.amount"
              v-money="money"
              label="Jumlah Pembayaran"
              prefix="Rp"
              :rules="[
                v => !!v || 'Jumlah Pembayaran is required'
              ]"
            />
            <v-checkbox
              label="Saya menyatakan informasi di atas adalah benar"
              value="value"
              :rules="[
                v => !!v || 'Pernyataan harus diisi'
              ]"
            />
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
    <v-dialog v-else-if="order.status === 4" v-model="manifestDialog" persistent max-width="350">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-btn icon dark @click.native="manifestDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          Lacak {{ order.shippingCode }} - {{ order.shippingService }}
          <v-spacer />
        </v-toolbar>
        <template v-for="(row, i) in manifest">
          <v-sheet :key="i" class="py-4 px-2">
            {{ row.manifest_time }}
            <div class="caption">
              {{ row.manifest_description }}, {{ row.city_name }}
            </div>
            <div class="caption grey--text">
              {{ row.manifest_date }}
            </div>
          </v-sheet>
          <v-divider :key="`divider-${i}`" />
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
export default {
  data () {
    return {
      orderNumber: this.$route.params.orderNo,
      order: [],
      confirmFormDialog: false,
      money: {
        thousands: '.',
        precision: 0,
        masked: false
      },
      formConfirm: {
        amount: 0,
        terminalId: null,
        acquirerId: null,
        refNumber: null
      },
      manifest: null,
      manifestDialog: false,
      cancelOrderNote: null,
      cancelOrderDialog: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.profile.meAsCustomer.id,
      banks: state => state.user.banks
    }),
    totalWeight () {
      return this.order.orderItems.reduce((a, b) => a + (b.weight || 0), 0)
    },
    totalQty () {
      return this.order.orderItems.reduce((a, b) => parseInt(a) + parseInt(b.quantity || 0), 0)
    }
  },
  created () {
    this.getOrderDetail()
  },
  methods: {
    doCopyVA () {
      const target = document.getElementById('va-number')
      target.select()
      target.setSelectionRange(0, 99999)

      try {
        // Now that we've selected the anchor text, execute the copy command
        const successful = document.execCommand('copy')
        const msg = successful ? 'successful' : 'unsuccessful'
        alert('Copy VA number was ' + msg)
      } catch (err) {
        alert('Oops, unable to copy')
      }

      // Remove the selections - NOTE: Should use
      // removeRange(range) when it is supported
      window.getSelection().removeAllRanges()
    },
    async doCheckResi () {
      if (this.order.shippingCode === 'jne') {
        window.open(`https://cekresi.com/?noresi=${this.order.trackingNo}`)
      } else {
        try {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          const { data } = await this.$axios.post('/Ongkirs/getWaybill', {
            waybill: this.order.trackingNo,
            courier: this.order.shippingCode
          })
          this.manifest = data
          this.manifestDialog = true
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
    },
    async getOrderDetail () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        const { data } = await this.$axios.get('/Orders/findOne', {
          params: {
            filter: {
              where: { orderNumber: this.orderNumber, customerId: this.userId },
              include: [
                { orderItems: 'productSet' },
                { shippingAddress: ['Province', 'City', 'District'] },
                { invoices: [{ paymentBank: 'bank' }, 'bank', 'discount'] },
                'promo'
              ]
            }
          }
        })
        this.order = data
        if (data.invoices.discount) {
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'info',
            message: `Order ini mendapatkan potongan harga dari program ${data.invoices.discount.title}, cek detail order untuk info selengkapnya.`
          })
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
    },
    openConfirmPaymentDialog: debounce(function () {
      this.$store.dispatch('user/getBanks')
      this.confirmFormDialog = true
    }, 500, { leading: false, trailing: true }),
    openCancelOrderDialog: debounce(function () {
      this.cancelOrderDialog = true
    }, 500, { leading: false, trailing: true }),
    doConfirmPayment: debounce(async function () {
      if (this.$refs.paymentConfirmationForm.validate()) {
        try {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          const { data } = await this.$axios.post('/Orders/confirmPayment', {
            id: this.order.id,
            data: this.formConfirm
          })
          this.confirmFormDialog = false
          this.$router.push('/transaction/unpaid')
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.openWa(data)
        } catch (error) {
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'error',
            message: error
          })
        }
      }
    }, 500, { leading: false, trailing: true }),
    openWa (data) {
      const phone = data.replace('0', '62')
      const message = `Assalamu'alaikum, Saya sudah melakukan pembayaran untuk ${this.order.invoices.invoiceNumber} sebesar Rp ${this.order.invoices.grandTotal} melalui ${this.formConfirm.terminalId} - ${this.formConfirm.refNumber} - an. ${this.formConfirm.acquirerId}`
      window.open(
        `https://api.whatsapp.com/send?phone=${phone}&text=${message}`,
        '_blank'
      )
    },
    doCancelOrder: debounce(async function () {
      if (this.$refs.cancelForm.validate()) {
        try {
          this.$nuxt.$emit('WAIT_DIALOG', true)
          await this.$axios.patch(`/Orders/${this.order.id}`, {
            status: 0,
            cancelledNote: this.cancelOrderNote
          })
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'success',
            message: 'Pesanan ini berhasil dibatalkan'
          })
          this.cancelOrderNote = null
          this.cancelOrderDialog = false
          this.getOrderDetail()
        } catch (error) {
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'error',
            message: error
          })
        }
      }
    }, 500, { leading: false, trailing: true })
  }
}
</script>
