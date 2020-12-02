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
    value: { default: false },

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

    values: {
      type: Object,
      default: () => ({ checked: true, unchecked: false }),
    },

    color: {
      type: String,
      default: 'primary',
      validator(val) {
        return ['primary', 'success', 'danger', 'warning', 'secondary', 'dark'].includes(val);
      },
    },

    invert: { type: Boolean, default: false },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  computed: {
    $_isChecked() {
      return this.value === this.values.checked;
    },

    isChecked() {
      // return !this.invert ? this.value : !this.value;
      return !this.invert ? this.$_isChecked : !this.$_isChecked;
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

      let newValue = null;

      if (!this.invert) {
        newValue = this.isChecked ? this.values.unchecked : this.values.checked;
      } else {
        newValue = this.isChecked ? this.values.checked : this.values.unchecked;
      }

      // const newValue = this.isChecked ? this.values.unchecked : this.values.checked;
      this.$emit(event, newValue);
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
