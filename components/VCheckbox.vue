<template>
  <client-only>
    <div class="checkbox" :class="[colorClass]">
      <input
        type="checkbox"
        :class="{ 'cursor-default': disabled }"
        :id="$_id"
        :checked="isChecked"
        :disabled="disabled"
        style="pointer-events: none"
        @click.prevent
      />
      <label
        class="custom-control-label"
        :class="{ 'cursor-pointer': !disabled }"
        :for="$_id"
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
      default: '',
    },

    id: {
      type: String,
      required: false,
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

  computed: {
    isChecked() {
      return !this.$props.invert ? this.$props.checked : !this.$props.checked;
    },

    colorClass() {
      return `checkbox-${this.color}`;
    },

    $_id() {
      return (
        this.id ||
        `check${Date.now()
          .toString()
          .substr(-8)}`
      );
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

.checkbox label::before {
  pointer-events: auto;
}
</style>
