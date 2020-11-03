<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark fixed-top"
    style="background-color: #2d5f8b"
  >
    <a class="navbar-brand" href="#">
      <img src="~/assets/images/logo.png" style="max-width: 240px" alt="" />
    </a>
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
            v-if="
              page.name === 'Home' ||
              page.name === 'Subscription' ||
              (
                page.name === 'Bills' &&
                tenant.statusId !== 4
              ) ||
              (
                page.name === 'Users' &&
                tenant.statusId !== 4
              )
            "
          >
            {{ page.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    pages: [
      { path: '/', name: 'Home' },
      { path: '/subscription', name: 'Subscription' },
      { path: '/users', name: 'Users' },
      { path: '/bills', name: 'Bills' },
    ],
  }),

  computed: {
    ...mapGetters('tenant', [
      'tenant',
    ]),
  }
};
</script>

<style></style>
