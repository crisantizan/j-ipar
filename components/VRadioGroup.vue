<template>
  <div class="d-flex" :class="{ 'flex-column': !inline }">
    <div
      v-for="item of items"
      :key="item.value"
      class="custom-control custom-radio"
      :class="{ 'mr-2': inline }"
    >
      <input
        type="radio"
        :id="`radio${item.value}`"
        :name="name"
        :value="item.value"
        :checked="item.value === value"
        class="custom-control-input"
        @change="onChange($event.target)"
      />
      <label class="custom-control-label" :for="`radio${item.value}`">
        {{ item.label }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      required: true,
      type: Array,
    },

    name: {
      required: true,
      type: String,
    },

    inline: {
      type: Boolean,
      default: true,
    },

    value: {
      type: String,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  methods: {
    onChange(target) {
      this.$emit('change', target.value);
    },
  },
};
</script>
