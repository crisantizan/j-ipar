<template>
  <div class="search btn-group mr-2">
    <input
      class="form-control search-input"
      type="text"
      placeholder="Search"
      autocomplete="off"
      :value="$props.value"
      @input="$emit('input', $event.target.value)"
    />
    <div class="btn btn-primary" style="cursor: default;">
      <i class="fa fa-search" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
  },
};
</script>

<style></style>
