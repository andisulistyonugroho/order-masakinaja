<template>
  <div>
    <LazyInvoiceIndex v-if="profile.acl_role === 'member'" />
    <LazyAdminInvoiceIndex v-if="profile.acl_role === 'superadmin'" />
  </div>
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
