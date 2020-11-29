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

      <!-- BTN CLOSE ADMIN PANEL -->

      <button
        v-if="messageGoToPrima !== ''"
        class="btn btn-danger"
        @click="openModalReturn"
      >
        {{ messageGoToPrima }}
        <i class="fas fa-window-close"></i>
      </button>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    pages: [
      // { path: '/', name: 'Home' },
      { path: '/subscription', name: 'Subscription' },
      { path: '/users', name: 'Users' },
      { path: '/bills', name: 'Bills' },
    ],
    titleModal: '',
    textModal: '',
    messageGoToPrima: '',
  }),

  computed: {
    ...mapGetters('tenant', [
      'tenant',
    ]),
  },

  mounted () {
    if (this.tenant.statusId === 4) {
      this.messageGoToPrima = 'Go to Prima.'
      this.titleModal = 'Are you sure you want to go to Prima?'
      this.textModal = `Remember subscribe before you go to Prima.`
    } else {
      this.messageGoToPrima = 'Finish and Return to Prima.'
      this.titleModal = 'Are you sure you want to return to Prima?'
      this.textModal = `Remember, after any changes a user must log into Prima again.`
    }
  },

  methods: {
    async openModalReturn () {
      const { isConfirmed } = await Swal.fire({
        title: this.titleModal,
        text: this.textModal,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!',
      });

      if (!isConfirmed) {
        return;
      }

      this.closeWindow();
    },

    closeWindow () {
      if (this.tenant.statusId === 4) window.open(process.env.PRIMA_URL, '_top');
      else window.close();
    }
  }
};
</script>

<style></style>
