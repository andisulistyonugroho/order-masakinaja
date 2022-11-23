<template>
  <CalendarIndex v-if="profile.acl_role !== 'superadmin'" />
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
