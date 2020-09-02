<template>
  <div>
    <navbar/>
    <div class="container-fluid" style="margin-top: 69.6px;">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  components: {
    navbar: () => import('~/components/Navbar'),
  },
  created() {
    this.getAll();
  },
  methods: {
    ...mapActions(['getAll']),
  },
};
</script>
