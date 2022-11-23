<template>
  <CalendarIndex v-if="profile.full_name !== 'superadmin'" />
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
