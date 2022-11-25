<template>
  <LazyInvoiceIndex v-if="profile.acl_role === 'member'" />
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      userId: state => state.user.id,
      profile: state => state.user.profile
    })
  }
}
</script>
