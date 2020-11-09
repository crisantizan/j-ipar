<script>
export default {
  functional: true,

  props: {
    to: { type: String, default: 'javascript:void(0)' },
    icon: { type: String, required: false },
    divider: { type: Boolean, default: false },
    routerLink: { type: Boolean, default: false },
    submenu: { type: Boolean, default: false },
    tag: { type: String, default: 'a' },
    arrowIndicator: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },

  render(createElement, ctx) {
    const children = [];

    // create icon
    if (!!ctx.props.icon) {
      children.push(
        createElement('i', {
          class: `fas fa-${ctx.props.icon} mr-1`,
        }),
      );
    }

    children.push(...(ctx.children || []));

    const classes = [
      {
        'border-bottom': ctx.props.divider,
        disabled: ctx.props.disabled,
        ...(ctx.data.class || {}),
      },
      ctx.props.submenu ? 'dropdown-item-submenu' : 'dropdown-item',
      ...(ctx.data.staticClass || '').split(' '),
    ];

    const tag = ctx.props.routerLink ? 'nuxt-link' : ctx.props.tag;

    const attrs = {};

    if (!ctx.props.submenu) {
      const tagProp = ctx.props.routerLink ? 'to' : 'href';
      attrs[tagProp] = ctx.props.to;
    }

    if (ctx.props.arrowIndicator) {
      children.push(
        createElement('i', {
          class: 'fas fa-angle-right float-right ml-2',
        }),
      );
    }

    return createElement(
      tag,
      {
        class: classes,
        attrs: { ...attrs, ...ctx.data.attrs },
        style: ctx.data.staticStyle || {},
        on: ctx.data.on || {},
      },
      children,
    );
  },
};
</script>
