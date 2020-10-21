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
import apolloToken from '@/helpers/apollo-token';

export default {
  components: {
    navbar: () => import('~/components/Navbar'),
  },

  computed: {
    ...mapState(['token']),
  },

  created() {
    // save token for Apollo context access
    if (!apolloToken.get() && !!this.token) {
      apolloToken.set(this.token);
    }
  },
};
</script>
