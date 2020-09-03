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
