<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li v-for="page in pages" :key="page.path" class="nav-item">
            <!-- :class="{ active: page.path === '/' }" -->
            <nuxt-link class="nav-link" :to="page.path">
              {{ page.name }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container-fluid">
      <Nuxt />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    pages: [
      { path: '/', name: 'Home' },
      { path: '/subscription', name: 'Subscription' },
      { path: '/bills', name: 'Bills' },
      { path: '/users', name: 'Users' },
    ],
  }),
};
</script>
