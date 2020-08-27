<template>
  <div>
    <navbar />
    <div class="container-fluid">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    navbar: () => import('~/components/Navbar'),
  },
};
</script>
