<template>
  <v-list>
    <v-sheet light class="pb-4 pt-2">
      <v-img
        lazy-src="/logo.png"
        src="/logo.png"
        alt="PA"
        max-height="80"
        contain
        @click="$router.push('/')"
      />
    </v-sheet>
    <template v-for="menu in menus">
      <!-- menu with child -->
      <v-list-group
        v-if="menu.child"
        :key="menu.title"
        :prepend-icon="menu.icon"
        no-action
        color="white--text"
        class="small"
      >
        <template #activator>
          <v-list-item-title>
            {{ menu.title }}
          </v-list-item-title>
        </template>
        <!-- sub menu -->
        <template v-for="sub in menu.child">
          <v-list-group
            v-if="sub.child"
            :key="sub.id"
            sub-group
            no-action
          >
            <v-list-item slot="activator">
              <v-list-item-title>{{ sub.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-for="(subchild) in sub.child"
              :key="subchild.id"
              router
              :to="subchild.to"
            >
              <v-list-item-title v-text="subchild.title" />
              <v-list-item-action v-if="subchild.icon">
                <v-icon small dark>
                  {{ subchild.icon }}
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="`subelse-${sub.title}`" :to="sub.to" nuxt router>
            <v-list-item-title v-text="sub.title" />
            <v-list-item-icon>
              <v-icon style="font-size: 19px;">
                {{ sub.icon }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </template>
      </v-list-group>
      <!-- menu without child -->
      <v-list-item v-else :key="`menuelse-${menu.title}`" :to="menu.to" router>
        <v-list-item-action>
          <v-icon>{{ menu.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="menu.title" />
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      menus: state => state.menu.all,
      userId: state => state.user.id,
      role: state => state.user.profile.acl_role
    })
  },
  created () {
    if (this.role) {
      this.$store.dispatch('menu/getMenuForMe', {
        userId: this.userId,
        roleName: this.role
      })
    }
  }
}
</script>
<style scoped>
.logout {
  cursor: pointer;
}
</style>
