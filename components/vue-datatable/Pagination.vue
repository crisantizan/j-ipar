<template>
  <div class="Pagination">
    <div class="Pagination__per-page">
      <span>{{ showPaginationData }}</span>

      <div class="dropdown">
        <button
          class="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ byPage }}
        </button>
        <div
          class="dropdown-menu p-0"
          style="min-width: 50px;"
          aria-labelledby="dropdownMenuButton"
        >
          <a
            v-for="item of $props.perPageDropdown"
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

    <div class="Pagination__items">
      <ul class="pagination">
        <!-- go to prev page -->
        <li class="page-item page-pre" :class="{ disabled: prevDisabled }">
          <a
            class="page-link"
            aria-label="previous page"
            href="javascript:void(0)"
            @click="customPageChange(page - 1)"
          >
            «
          </a>
        </li>

        <!-- dynamic pages -->
        <li
          v-for="pageNumber in totalPages"
          :key="pageNumber"
          class="page-item"
          :class="{ active: page === pageNumber }"
        >
          <a
            class="page-link"
            :aria-label="`to page ${pageNumber}`"
            href="javascript:void(0)"
            @click="customPageChange(pageNumber)"
          >
            {{ pageNumber }}
          </a>
        </li>

        <!-- go to next page -->
        <li class="page-item page-next" :class="{ disabled: nextDisabled }">
          <a
            class="page-link"
            aria-label="next page"
            href="javascript:void(0)"
            @click="customPageChange(page + 1)"
          >
            »
          </a>
        </li>
      </ul>
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
    perPageDropdown: {
      type: Array,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    // perPageDropdown: [5, 10, 15, 20],
    byPage: 0,
    page: 1,
  }),
  computed: {
    totalPages() {
      return Math.ceil(this.$props.total / this.byPage);
    },

    /** show message with pagination data */
    showPaginationData() {
      const { total } = this.$props;
      const { page, byPage } = this;

      const row = page * byPage - (byPage - 1);
      let endRow = row + byPage - 1;

      if (endRow > total) {
        endRow = total;
      }

      return `Showing ${row} to ${endRow} of ${total} rows`;
    },

    nextDisabled() {
      return this.page === this.totalPages;
    },

    prevDisabled() {
      return this.page === 1;
    },
  },
  created() {
    this.customPerPageChange(this.$props.perPage);
  },
  methods: {
    /** updaye "page" value on dtatable */
    customPageChange(customCurrentPage) {
      this.page = customCurrentPage;
      this.pageChanged({ currentPage: customCurrentPage });
    },

    /** update "perPage" value on datatable */
    customPerPageChange(customPerPage) {
      this.byPage = customPerPage;
      this.page = 1;
      this.perPageChanged({ currentPerPage: customPerPage });
    },
  },
};
</script>

<style scoped>
.Pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.Pagination__per-page {
  display: flex;
  align-items: center;
}

.Pagination__per-page .dropdown {
  margin: 0 0.3rem;
}

.Pagination__items .pagination {
  margin-bottom: 0;
}

.dropdown-toggle {
  width: 33px;
  height: 35.5px;
  display: flex;
  justify-content: center;
}

.page-item.active .page-link {
  background-color: #6658dd;
  border-color: #6658dd;
}
</style>
