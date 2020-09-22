<template>
	<client-only>
		<div class="table-wrapper w-100">

			<!-- custom header -->
			<div class="d-flex justify-content-between align-items-center mb-2">
				<div class="d-flex">
					<!-- search input component -->
					<table-input-search v-model="searchTerm" />
					<!-- columns toggle button component -->
					<table-button-toggle-columns :columns="toggleColumnList" />

					<slot name="header-left"></slot>
				</div>

				<slot name="header-right"></slot>
			</div>

			<slot name="second-header"> </slot>
			<!-- end custom header -->

			<vue-good-table
				:styleClass="$_styleClass"
				:columns="$props.columns"
				:rows="$props.rows"
				height="calc(100vh - 275px)"
				:row-style-class="$props.rowStyleClass"
				:pagination-options="{
					mode: 'pages',
					enabled: $props.pagination.enabled,
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
				<!-- end table-row slot -->

				<!-- pagination slot -->
				<template
					v-if="$props.pagination.enabled"
					slot="pagination-bottom"
					slot-scope="props"
				>
					<table-pagination
						v-bind="props"
						:per-page="$props.pagination.perPage"
						:per-page-dropdown="$props.pagination.perPageDropdown"
					/>
				</template>
				<!-- end pagination slot -->

			</vue-good-table>
		</div>
	</client-only>
</template>

<script>
export default {
	components: {
		TablePagination: () => import('./TablePagination'),
		TableButtonToggleColumns: () => import('./TableButtonToggleColumns'),
		TableInputSearch: () => import('./TableInputSearch'),
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

		pagination: {
			type: Object,
			default: () => ({
				enabled: true,
				perPageDropdown: [5, 10, 15, 20],
				perPage: 5,
			}),
		},

		rowStyleClass: {
			type: [String, Function],
			default: '',
		},

		styleClass: {
			type: String,
			default: '',
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

		$_styleClass() {
			return `vgt-table my-table table-hover ${this.$props.styleClass}`;
		},
	},
};
</script>
