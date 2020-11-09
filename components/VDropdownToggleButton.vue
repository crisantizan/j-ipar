<script>
export default {
  functional: true,

  props: {
    alignRight: { type: Boolean, default: false },
    tag: {
      type: String,
      default: 'button',
      validator(value) {
        return ['a', 'button'].includes(value);
      },
    },
    navLink: {
      type: Boolean,
      default: false,
    },
  },

  render(createElement, ctx) {
    // HTML attributes
    const attrs = {
      'data-toggle': 'dropdown',
      'aria-haspopup': 'true',
      'aria-expanded': 'false',
    };

    if (ctx.props.tag === 'a') {
      attrs.role = 'button';
      attrs.href = '#';
    } else {
      attrs.type = 'button';
    }

    const classes = [
      {
        'nav-link': ctx.props.navLink,
        'dropdown-toggle': true,
      },
      ...(ctx.data.staticClass || '').split(' '),
    ];

    return createElement(
      ctx.props.tag,
      {
        ...ctx.data,
        class: classes,
        attrs: { ...attrs, ...ctx.data.attrs },
      },
      ctx.children,
    );
  },
};
</script>
