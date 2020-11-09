<script>
export default {
  functional: true,

  render(createElement, ctx) {
    const attrs = {
      role: 'document',
    };

    return createElement(
      'div',
      {
        ...ctx.data,
        class: ['modal-dialog'],
        attrs: {
          ...attrs,
          ...ctx.data.attrs,
        },
      },
      ctx.children,
    );
  },
};
</script>
