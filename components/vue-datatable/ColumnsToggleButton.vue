<template>
  <div class="dropdown">
    <button
      class="btn btn-primary dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <i class="fa fa-th-list" aria-hidden="true"></i>
    </button>

    <div class="dropdown-menu p-0" aria-labelledby="dropdownMenuButton">
      <form @submit.prevent>
        <div
          v-for="column of $props.columns"
          :key="column.field"
          class="dropdown-item px-0"
        >
          <div class="custom-control custom-checkbox mx-2">
            <input
              type="checkbox"
              class="custom-control-input"
              :id="`toggle${column.field}`"
              :checked="!column.hidden"
              @change="() => (column.hidden = !column.hidden)"
            />
            <label
              class="custom-control-label d-flex align-items-center"
              :for="`toggle${column.field}`"
            >
              {{ column.label }}
            </label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

<style></style>
