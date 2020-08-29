<template>
  <client-only>
    <div class="table-wrapper">
      <!-- custom header -->
      <div class="d-flex mb-2">
        <!-- search input component -->
        <search-input v-model="searchTerm" />
        <!-- columns toggle button component -->
        <columns-toggle-button :columns="toggleColumnList" />
      </div>
      <!-- end custom header -->

      <vue-good-table
        styleClass="vgt-table my-table table-hover"
        compactMode
        :columns="$props.columns"
        :rows="$props.rows"
        :pagination-options="{
          enabled: true,
          mode: 'pages',
        }"
        :search-options="{
          enabled: true,
          externalQuery: searchTerm,
        }"
      >
        <!-- table-row slot -->
        <template slot="table-row" slot-scope="props">
          <slot name="table-row" v-bind="props"></slot>
        </template>

        <!-- pagination slot -->
        <template slot="pagination-bottom" slot-scope="props">
          <pagination v-bind="props" />
        </template>
      </vue-good-table>
    </div>
  </client-only>
</template>

<script>
export default {
  components: {
    Pagination: () => import('./Pagination'),
    ColumnsToggleButton: () => import('./ColumnsToggleButton'),
    SearchInput: () => import('./SearchInput'),
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    /** search value */
    searchTerm: '',
  }),
  computed: {
    /** get columns "toggleables" */
    toggleColumnList() {
      return this.$props.columns.filter(column => column.toggle);
    },
  },
};
</script>
