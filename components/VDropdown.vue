<script>
import dropdownMixin from '~/mixins/dropdown.mixin';

export default {
  props: {
    tag: {
      type: String,
      default: 'div',
      // only "div" and "li" values ​​are accepted
      validator(value) {
        return ['div', 'li'].includes(value);
      },
    },

    navItem: {
      type: Boolean,
      default: false,
    },

    multilevel: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isOpen: false,
  }),

  mixins: [dropdownMixin],

  render(createElement) {
    return createElement(
      this.$props.tag,
      {
        class: {
          dropdown: true,
          'dropdown-multilevel': this.$props.multilevel,
          'nav-item': this.$props.navItem,
          [this.dropdownMixin_id]: true,
        },
        attrs: {
          // property comes from mixin «dropdown»
          id: this.dropdownMixin_id,
        },
      },
      // this.$slots.default
      this.$scopedSlots.default({
        id: this.dropdownMixin_id,
        isOpen: this.isOpen,
        closeDropdownFn: this.closeDropdown,
      }),
    );
  },

  mounted() {
    const self = this;

    // open dropdown event
    $(`#${this.dropdownMixin_id}`).on('show.bs.dropdown', function() {
      self.isOpen = true;
      self.$emit('open', this.dropdownMixin_id);
    });

    // close dropdown event
    $(`#${this.dropdownMixin_id}`).on('hide.bs.dropdown', function() {
      self.isOpen = false;
      self.$emit('close', this.dropdownMixin_id);
    });
  },

  methods: {
    closeDropdown() {
      $(`.${this.dropdownMixin_id} .dropdown-toggle`).dropdown('hide');
    },
  },
};
</script>
