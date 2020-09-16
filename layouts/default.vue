<template>
  <div>
    <navbar/>
    <div class="container-fluid">
      <div style="height: 69.6px"></div>
      <Nuxt />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    navbar: () => import('~/components/Navbar'),
  },
  computed: {
    ...mapState(['token']),
  },
  created() {
    // save token locally (in cookie)
    if (!this.$apolloHelpers.getToken() && !!this.token) {
      console.log('Set token...');
      this.$apolloHelpers.onLogin(this.token);
    }
  },
  methods: {
    ...mapActions(['getAll']),
  },
};
</script>
