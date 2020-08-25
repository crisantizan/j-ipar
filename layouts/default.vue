<template>
  <div>
    <nav
      class="navbar navbar-expand-lg navbar-light"
      style="background-color: rgba(0,0,0,.03)"
    >
      <a class="navbar-brand" href="#">LOGO</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li v-for="page in pages" :key="page.path" class="nav-item">
            <nuxt-link
              class="nav-link"
              :to="page.path"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
            >
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
