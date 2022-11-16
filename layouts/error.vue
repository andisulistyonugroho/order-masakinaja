<template>
  <v-container fill-height fluid>
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12" sm="8" md="4">
        <v-card outlined>
          <v-card-title
            class="justify-center headline"
          >
            <v-img
              lazy-src="/logo.png"
              src="/logo.png"
              alt="MASAKINAJA"
              max-height="133"
              contain
              @click="$router.push('/')"
            />
          </v-card-title>
          <v-card-text class="text-center pa-5">
            <h1 v-if="error.statusCode === 404">
              Page not found
            </h1>
            <h1 v-else>
              Maaf ada error
            </h1>
            <div class="pt-5">
              {{ error }}<br>
              <NuxtLink to="/">
                Home page
              </NuxtLink>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ErrLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>
