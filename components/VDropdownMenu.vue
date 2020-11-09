<script>
export default {
  functional: true,

  props: {
    alignRight: { type: Boolean, default: false },
    pullLeft: { type: Boolean, default: false },
  },

  render(createElement, ctx) {
    return createElement(
      'div',
      {
        class: {
          'dropdown-menu': true,
          'dropdown-menu-right': ctx.props.alignRight,
          'dropdown-menu-left': ctx.props.pullLeft,
        },
        ...ctx.data,
      },
      ctx.children,
    );
  },
};
</script>
