<template>
  <client-only>
    <div class="checkbox" :class="[colorClass]">
      <input
        type="checkbox"
        :class="{ 'cursor-default': disabled }"
        :id="checkId"
        :checked="isChecked"
        :disabled="disabled"
        @click.prevent
      />
      <label
        class="custom-control-label"
        :class="{ 'cursor-pointer': !disabled }"
        :for="checkId"
        @click="onClick"
      >
        {{ $props.label }}
      </label>
    </div>
  </client-only>
</template>

<script>
export default {
  props: {
    checked: { type: Boolean, default: false },

    async: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: 'Label',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String,
      default: 'primary',
      validator(val) {
        return [
          'primary',
          'success',
          'danger',
          'warning',
          'secondary',
          'dark',
        ].includes(val);
      },
    },

    invert: { type: Boolean, default: false },
  },

  model: {
    prop: 'checked',
    event: 'change',
  },

  data: () => ({
    checkId: `check${Date.now()
      .toString()
      .substr(-8)}`,
  }),

  computed: {
    isChecked() {
      return !this.$props.invert ? this.$props.checked : !this.$props.checked;
    },

    colorClass() {
      return `checkbox-${this.color}`;
    },
  },

  methods: {
    onClick() {
      if (this.disabled) return;

      const event = !this.async ? 'change' : 'change-async';

      this.$emit(event, !this.$props.checked);
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.cursor-default {
  cursor: default !important;
}

.custom-control-label {
  padding-top: 1px;
}
</style>
