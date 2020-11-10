<script>
export default {
  props: {
    persistent: {
      type: Boolean,
      default: false,
    },

    value: {
      type: Boolean,
      default: false,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  render(createElement) {
    const attrs = {
      tabindex: -1,
      role: 'dialog',
      'aria-hidden': 'true',
    };

    if (this.$props.persistent) {
      attrs['data-backdrop'] = 'static';
    }

    return createElement(
      'div',
      {
        class: ['modal', 'fade'],
        attrs,
        ref: 'modal',
      },
      this.$slots.default,
    );
  },

  watch: {
    '$props.value': {
      immediate: true,
      handler(val, oldVal) {
        if (!val && typeof oldVal === 'undefined') return;

        if (val) {
          this.showModalFn();
          return;
        }

        this.hideModalFn();
      },
    },
  },

  mounted() {
    const self = this;

    $(this.$refs.modal).on('hidden.bs.modal', function(e) {
      self.$emit('change', false);
    });
  },

  methods: {
    showModalFn() {
      $(this.$refs.modal).modal('show');
    },

    hideModalFn() {
      $(this.$refs.modal).modal('hide');
    },
  },
};
</script>
