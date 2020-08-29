<template>
  <div class="Pagination">
    <div class="Pagination__per-page">
      <span>{{ showing }}</span>
      <div class="dropdown">
        <button
          class="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ perPage }}
        </button>
        <div
          class="dropdown-menu p-0"
          style="min-width: 50px;"
          aria-labelledby="dropdownMenuButton"
        >
          <a
            v-for="item of perPageDropdown"
            :key="item"
            class="dropdown-item"
            href="#"
            @click="customPerPageChange(item)"
          >
            {{ item }}
          </a>
        </div>
      </div>
      <span>rows per page</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageChanged: {
      type: Function,
    },
    perPageChanged: {
      type: Function,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    perPageDropdown: [5, 10, 15, 20],
    perPage: 5,
    page: 1,
  }),
  computed: {
    totalPages() {
      return this.$props.total / this.perPage;
    },
    showing() {
      const { total } = this.$props;
      const { perPage, page } = this;

      const row = page * perPage - (perPage - 1);
      const endRow = row + perPage - 1;

      return `Showing ${row} to ${endRow} of ${total} rows`;
    },
  },
  created() {
    this.customPerPageChange(this.perPage);
  },
  methods: {
    customPageChange(customCurrentPage) {
      this.page = customCurrentPage;
      this.pageChanged({ currentPage: customCurrentPage });
    },
    customPerPageChange(customPerPage) {
      this.perPage = customPerPage;
      this.perPageChanged({ currentPerPage: customPerPage });
    },
  },
};
</script>

<style scoped>
.Pagination {
  margin-top: 1rem;
}

.Pagination__per-page {
  display: flex;
  align-items: center;
}

.Pagination__per-page .dropdown {
  margin: 0 .3rem;
}
</style>
