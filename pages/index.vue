<template>
  <section :class="$vuetify.breakpoint.mobile ? 'pa-0' : 'pa-3'">
    <v-stepper
      v-model="step"
      vertical
      :style="$vuetify.breakpoint.mobile ? 'box-shadow: none;' : ''"
    >
      <v-stepper-step
        :complete="step > 1"
        :editable="step > 1"
        step="1"
      >
        Pilih produk
        <small>Keranjang belanja</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
              md="4"
              class="pb-0"
            >
              <v-select
                v-model="productSeriesId"
                :rules="[
                  (v) => !!v || 'Series is required'
                ]"
                label="Series"
                :items="series"
                item-text="name"
                item-value="id"
                class="caption my-0"
              />
            </v-col>
            <v-col
              cols="12"
              md="7"
              class="pb-0"
            >
              <v-select
                v-model="productSetId"
                :rules="[
                  (v) => !!v || 'Product Set is required'
                ]"
                label="Product Set"
                :items="productSets"
                item-value="id"
                class="caption my-0"
              >
                <template slot="selection" slot-scope="data">
                  {{ data.item.name }}, Rp{{ data.item.price|toMoney }}
                </template>
                <template slot="item" slot-scope="data">
                  {{ data.item.name }},
                  <template v-if="data.item.discount > 0">
                    <strike>
                      {{ data.item.basePrice|toMoney }},
                    </strike>
                    &nbsp;diskon {{ data.item.discount|toMoney }} = Rp{{ data.item.price|toMoney }}
                  </template>
                  <template v-else>
                    Rp{{ data.item.price|toMoney }}
                  </template>
                </template>
              </v-select>
            </v-col>
            <v-col
              cols="12"
              md="1"
              class="pb-0"
            >
              <v-text-field
                v-model="quantity"
                :rules="[
                  (v) => !!v || 'Jumlah is required',
                  (v) => Number.isInteger(Number(v)) || 'integer required',
                  (v) => ( v && v >= 1) || '0 not valid'
                ]"
                label="Jumlah"
                type="number"
                min="1"
                class="caption my-0"
              />
            </v-col>
            <v-col
              cols="12"
              class="pt-0"
            >
              <v-btn
                block
                tile
                outlined
                color="success"
                dark
                @click="addToCart"
              >
                Tambah ke keranjang
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-row>
          <v-col cols="12">
            <v-divider />
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">
                    Item
                  </th>
                  <th class="text-left">
                    Price (Rp)
                  </th>
                  <th class="text-left">
                    Jlh
                  </th>
                  <th class="text-left">
                    Subtotal (Rp)
                  </th>
                  <th class="text-left" width="5%">
                    Hapus
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in cart"
                  :key="item.name"
                >
                  <td>
                    {{ item.productSet.name }}
                    <div class="indigo--text font-italic" style="font-size: 0.65rem;">
                      bruto: {{ item.productSet.weight }} gr
                    </div>
                  </td>
                  <td>{{ item.price|toMoney }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.subtotal|toMoney }}</td>
                  <td>
                    <v-btn
                      icon
                      color="error"
                      small
                      @click="removeItem(item.productSetId)"
                    >
                      <v-icon dense>
                        mdi-trash-can-outline
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row v-if="cart.length > 0">
          <v-col class="text-right">
            <v-text-field
              v-model="orderNote"
              label="Catatan untuk admin"
            />
            <v-btn color="success" @click="step = 2">
              lanjut
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-step
        :complete="step > 2"
        :editable="step > 2"
        step="2"
      >
        Pilih alamat pengiriman
        <small>Alamat pengiriman</small>
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-row v-for="shippingAddress in customerData.shippingAddresses" :key="shippingAddress.id" class="mt-5" @click="shippingAddressId = shippingAddress.id">
          <v-col cols="1">
            <v-icon color="primary">
              {{ shippingAddress.id === shippingAddressId ? 'mdi-check-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}
            </v-icon>
          </v-col>
          <v-col :key="`chop-${shippingAddress.id}`" cols="11" class="pb-2 pt-1">
            <div class="font-weight-bold caption">
              {{ shippingAddress.name }}
            </div>
            <div class="caption pb-2">
              {{ shippingAddress.address }},
              {{ shippingAddress.District.name }}, {{ shippingAddress.City.name }}, {{ shippingAddress.Province.name }},
              {{ shippingAddress.zipcode }}<br>
              {{ shippingAddress.mobile }}
            </div>
          </v-col>
          <v-col>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="text-right">
            <v-btn color="success" @click="showShippingList = true">
              Kelola Alamat
            </v-btn>
            <v-btn v-if="shippingAddressId" color="success" @click="go2Shipping">
              lanjut
            </v-btn>
          </v-col>
        </v-row>
      </v-stepper-content>

      <v-stepper-step
        :complete="step > 3"
        :editable="step > 3"
        step="3"
      >
        Pilih Kurir
        <small>{{ shippingCost.code ? `${shippingCost.code} - ${shippingCost.service}` : 'Ongkos kirim' }}</small>
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-row v-if="couriers.length === 0">
          <v-col class="text-right">
            <v-btn color="success" @click="pickup">
              Ambil sendiri
            </v-btn>
            <v-btn color="success" @click="getOngkir">
              Cek Ongkir
            </v-btn>
          </v-col>
        </v-row>
        <template v-if="couriers.length > 0">
          <template v-for="courier in couriers">
            <v-list
              :key="courier.code"
              two-line
              subheader
              dense
            >
              <v-subheader class="px-0">
                {{ courier.name }}
              </v-subheader>

              <v-list-item v-for="services in courier.costs" :key="services.id" class="px-0" @click="setShippingCost(courier.code, services)">
                <v-list-item-action class="mr-2">
                  <v-btn
                    text
                    icon
                    color="primary"
                    @click="setShippingCost(courier.code, services)"
                  >
                    <v-icon>
                      {{ courier.code === shippingCost.code && services.service === shippingCost.service ? 'mdi-check-circle-outline' : 'mdi-checkbox-blank-circle-outline' }}
                    </v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Rp{{ services.cost[0].value|toMoney }}</v-list-item-title>
                  <v-list-item-subtitle class="caption">
                    {{ services.description }} ({{ services.service }}), {{ services.cost[0].etd }} hari
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider :key="`divider-${courier.code}`" />
          </template>
          <v-row v-if="shippingCost.code">
            <v-col class="text-right">
              <v-btn color="success" @click="step = 4">
                lanjut
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-stepper-content>

      <v-stepper-step
        :complete="step > 4"
        :editable="step > 4"
        step="4"
      >
        Kode Promo
        <small>Diskon &amp; Potongan</small>
      </v-stepper-step>
      <v-stepper-content step="4">
        <v-text-field
          v-model="promoCode"
          placeholder="PROMO-XYZ"
          hint="Masukkan kode promo"
          persistent-hint
          clearable
        />
        <v-btn color="success" @click="checkPromo">
          Gunakan
        </v-btn>
        <v-btn color="success" @click="skipPromo">
          skip
        </v-btn>
      </v-stepper-content>
    </v-stepper>
    <v-footer
      dark
      absolute
    >
      <v-container fluid class="py-1">
        <v-row class="caption">
          <v-col cols="12" class="overline pt-2 pb-0">
            Ringkasan belanja
          </v-col>
          <v-col cols="6" class="py-0">
            Total Harga ({{ totalQty|toMoney }} barang)
          </v-col>
          <v-col cols="6" class="text-right py-0">
            Rp{{ total|toMoney }}
          </v-col>
          <v-col cols="6" class="py-0">
            Total Ongkir ({{ weight|toMoney }} gr)
          </v-col>
          <v-col cols="6" class="text-right py-0">
            Rp{{ shippingCost.value|toMoney }}
          </v-col>
          <template v-if="promoId">
            <v-col cols="12" class="py-0">
              Promo: {{ promoCode }}
            </v-col>
            <v-col cols="6" class="py-0">
              Diskon Barang {{ thePromo.discountPercentage * 100 }}% + cashback
            </v-col>
            <v-col cols="6" class="text-right py-0">
              Rp -{{ orderDiscount|toMoney }}
            </v-col>
            <v-col cols="6" class="py-0">
              Diskon Ongkir max Rp{{ thePromo.freeShipping|toMoney }}
            </v-col>
            <v-col cols="6" class="text-right py-0">
              Rp -{{ shippingDiscount|toMoney }}
            </v-col>
          </template>
          <v-col cols="12" class="py-0">
            <div class="font-weight-bold subtitle-1">
              Total Tagihan
            </div>
            <div class="warning--text font-weight-bold subtitle-1">
              Rp{{ grandTotal|toMoney }}
            </div>
          </v-col>
          <template v-if="((shippingCost.value > 0 && isPickup === false) || (isPickup === true && shippingCost.value === 0 )) && shippingAddressId && step === 5">
            <v-col cols="6">
              <v-btn block color="error" @click="doCancel">
                batalkan
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block color="warning" class="black--text" @click="dialogCreate = true">
                create order
              </v-btn>
              <v-dialog
                v-model="dialogCreate"
                persistent
                max-width="334"
              >
                <v-card>
                  <v-card-title class="headline">
                    Buat order baru?
                  </v-card-title>
                  <v-card-text>Order akan disimpan dalam sistem, anda akan menerima invoice berisi total tagihan yang harus dibayar.</v-card-text>
                  <v-card-text v-if="paymentBanks">
                    <v-select
                      v-model="paymentBankId"
                      :items="paymentBanks"
                      item-value="id"
                      label="Pembayaran"
                      placeholder="Pilih pembayaran"
                      clearable
                    >
                      <template slot="selection" slot-scope="data">
                        {{ data.item.bank.name }}
                      </template>
                      <template slot="item" slot-scope="data">
                        {{ data.item.bank.name }}
                      </template>
                    </v-select>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      v-if="paymentBankId"
                      color="green darken-1"
                      text
                      @click="dialogCreate = false;createOrder()"
                    >
                      ya, setuju
                    </v-btn>
                    <v-btn
                      color="error darken-1"
                      text
                      @click="dialogCreate = false"
                    >
                      batal
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </template>
        </v-row>
        <ShippingList :dialog="showShippingList" @closeList="showShippingList = false" />
      </v-container>
    </v-footer>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'lodash.debounce'
import ShippingList from '@/components/ShippingList'
export default {
  components: {
    ShippingList
  },
  data () {
    return {
      productSeriesId: null,
      productSetId: null,
      cart: [],
      quantity: 1,
      step: 1,
      tab: null,
      shippingAddressId: null,
      couriers: [],
      shippingCost: {
        code: null,
        service: null,
        value: 0
      },
      dialogCreate: false,
      paymentBankId: null,
      promoCode: null,
      thePromo: [],
      promoId: null,
      orderDiscount: 0,
      shippingDiscount: 0,
      isPickup: false,
      orderNote: null,
      showShippingList: false
    }
  },
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile,
      series: state => state.product.series,
      productSets: state => state.product.productSets,
      customers: state => state.customer.found,
      paymentBanks: state => state.product.paymentBanks,
      customerData: state => state.user.profile.meAsCustomer
    }),
    total () {
      return this.cart.reduce((a, b) => a + (b.subtotal || 0), 0)
    },
    totalQty () {
      return this.cart.reduce((a, b) => parseInt(a) + parseInt(b.quantity || 0), 0)
    },
    weight () {
      return this.cart.reduce((a, b) => a + (b.totalWeight || 0), 0)
    },
    grandTotal () {
      return this.total - this.orderDiscount + this.shippingCost.value - this.shippingDiscount
    }
  },
  watch: {
    productSeriesId (val) {
      this.$store.dispatch('product/getProductSets', { productSeriesId: val })
    }
  },
  created () {
    this.$store.dispatch('product/getSeries')
    this.$store.dispatch('product/getPaymentBanks')
    this.$nuxt.$emit('TITLE_BAR', 'Form Pembelian')
  },
  mounted () {
    if (!this.profile.joinDate) {
      this.$nuxt.$emit('ONBOARDING_CHANGE_PASSWD', true)
      this.$nuxt.$emit('EAT_SNACKBAR', {
        view: true,
        color: 'error',
        message: 'Anda masih menggunakan password yang digenerate oleh sistem, sangat dianjurkan untuk mengganti password sebelum melanjutkan.'
      })
    }
  },
  methods: {
    addToCart: debounce(function () {
      if (this.$refs.form.validate()) {
        const productSet = this.productSets.find(obj => obj.id === this.productSetId)
        const index = this.cart.findIndex(obj => obj.productSetId === this.productSetId)
        if (index < 0) {
          this.cart.push({
            productSet,
            productSetId: this.productSetId,
            quantity: parseInt(this.quantity),
            price: productSet.price,
            subtotal: this.quantity * productSet.price,
            weight: productSet.weight,
            totalWeight: this.quantity * productSet.weight
          })
        } else {
          this.cart[index].quantity = parseInt(this.cart[index].quantity) + parseInt(this.quantity)
          this.cart[index].subtotal = this.cart[index].price * this.cart[index].quantity
          this.cart[index].totalWeight = this.cart[index].weight * this.cart[index].quantity
        }
      }
    }, 1000, { leading: true, trailing: false }),
    removeItem: debounce(function (productSetId) {
      const index = this.cart.findIndex(obj => obj.productSetId === productSetId)
      this.cart.splice(index, 1)
    }, 1000, { leading: true, trailing: false }),
    findCustomer: debounce(function (event) {
      if (event.keyCode !== 13) {
        this.shippingAddressId = null
        this.$store.dispatch('customer/findCustomer', { search: this.search, userId: this.userId })
      }
    }, 500, { leading: false, trailing: true }),
    getOngkir: debounce(function () {
      if (this.weight > 0 && this.customerData && this.shippingAddressId) {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        const address = this.customerData.shippingAddresses.find(obj => obj.id === this.shippingAddressId)
        this.$axios.post('/Ongkirs/getCost', {
          origin: 1580,
          destination: address.districtId,
          weight: this.weight
        }).then((response) => {
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.couriers = response.data.ongkir
        }).catch((error) => {
          this.$nuxt.$emit('WAIT_DIALOG', false)
          this.$nuxt.$emit('EAT_SNACKBAR', {
            view: true,
            color: 'error',
            message: error
          })
        })
        // this.$store.dispatch('product/getPaymentBanks')
      } else {
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: 'Tidak ada barang dalam keranjang belanja'
        })
      }
    }, 1000, { leading: true, trailing: false }),
    pickup: debounce(function () {
      this.isPickup = true
      this.couriers = []
      this.shippingCost = {
        code: null,
        service: null,
        value: 0
      }
      this.step = 4
    }, 1000, { leading: true, trailing: false }),
    setShippingCost: debounce(function (courierCode, data) {
      this.shippingCost = {
        code: courierCode,
        service: data.service,
        value: data.cost[0].value
      }
      this.isPickup = false
    }, 600, { leading: false, trailing: true }),
    createOrder: debounce(function () {
      this.$nuxt.$emit('WAIT_DIALOG', true)
      this.$axios.post('/Orders', {
        customerId: this.customerData.id,
        userId: this.customerData.userId,
        shippingCode: this.isPickup === true ? '-' : this.shippingCost.code,
        shippingService: this.isPickup === true ? '-' : this.shippingCost.service,
        shippingAddressId: this.shippingAddressId,
        cart: this.cart,
        total: this.total,
        orderDiscount: this.orderDiscount,
        shippingDiscount: this.shippingDiscount,
        grandTotal: this.grandTotal,
        shippingAmount: this.shippingCost.value,
        paymentBankId: this.paymentBankId,
        promoId: this.promoId,
        orderNote: this.isPickup === true ? `AMBIL SENDIRI ${this.orderNote}` : this.orderNote
      }).then((response) => {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'success',
          message: 'Order berhasil disimpan'
        })
        this.$router.push(`/order/${response.data.orderNumber}`)
      }).catch((error) => {
        this.$nuxt.$emit('WAIT_DIALOG', false)
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
      })
    }, 2000, { leading: true, trailing: false }),
    go2Shipping () {
      this.step = 3
      this.couriers = []
      this.shippingCost = {
        code: null,
        service: null,
        value: 0
      }
    },
    checkPromo: debounce(async function () {
      try {
        this.$nuxt.$emit('WAIT_DIALOG', true)
        if (this.thePromo.length === 0) {
          const { data } = await this.$axios.post('/Promos/usePromo', {
            promoCode: this.promoCode,
            userId: this.userId,
            cart: this.cart
          })
          this.thePromo = data
          this.promoId = this.thePromo.id
          this.orderDiscount = this.total * this.thePromo.discountPercentage + (this.thePromo.cashback * this.quantity)
          this.shippingDiscount = this.thePromo.freeShipping > this.shippingCost.value ? this.shippingCost.value : this.thePromo.freeShipping
          this.step = 5
        }
        this.$nuxt.$emit('WAIT_DIALOG', false)
      } catch (error) {
        this.$nuxt.$emit('EAT_SNACKBAR', {
          view: true,
          color: 'error',
          message: error
        })
        this.$nuxt.$emit('WAIT_DIALOG', false)
      }
    }, 700, { leading: true, trailing: false }),
    skipPromo () {
      this.promoCode = this.promoId = null
      this.thePromo = []
      this.orderDiscount = this.shippingDiscount = 0
      this.step = 5
    },
    doCancel () {
      this.$refs.form.reset()
      this.productSeriesId = null
      this.productSetId = null
      this.cart = []
      this.quantity = 1
      this.step = 1
      this.tab = null
      this.shippingAddressId = null
      this.couriers = []
      this.shippingCost = {
        code: null,
        service: null,
        value: 0
      }
      this.promoCode = null
      this.thePromo = []
      this.promoId = null
      this.orderDiscount = 0
      this.shippingDiscount = 0
      this.isPickup = false
      this.orderNote = null
      this.showShippingList = false
    }
  }
}
</script>
