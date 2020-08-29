<template>
  <pre>
    {{ $props }}
  </pre>
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
  methods: {
    customPageChange(customCurrentPage) {
      this.pageChanged({ currentPage: customCurrentPage });
    },
    customPerPageChange(customPerPage) {
      this.perPageChanged({ currentPerPage: customPerPage });
    },
  },
};
</script>

<style></style>
