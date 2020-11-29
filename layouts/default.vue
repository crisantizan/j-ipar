<template>
  <div>
    <TheNavbar />
    <div class="container-fluid">
      <div style="height: 73.94px"></div>
      <Nuxt />
    </div>
    <Loading v-model="loading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['loading']),
  },

  mounted() {
    $.noConflict();
  }
};
</script>
