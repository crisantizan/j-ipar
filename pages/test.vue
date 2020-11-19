<template>
  <div class="mt-4">
    <VCheckbox
      v-model="checked"
      async
      color="success"
      label="California"
      @change-async="onChange"
    />
    <pre>checked: {{ checked }}</pre>
  </div>
</template>

<script>
export default {
  data: () => ({
    checked: false,
  }),

  methods: {
    onChange(checked) {
      console.log(checked);
      this.checked = checked;
    }
  }
};
</script>

<style></style>
