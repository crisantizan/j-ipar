export default {
  data() {
    return {
      dropdownMixin_id: `dropdown${Date.now()}`,
    };
  },

  mounted() {
    const self = this;
    const selector = `#${this.dropdownMixin_id} .dropdown-item-submenu > .dropdown-item`;

    // click on submenu
    $(selector).on('click', function(e) {
      const $siblings = Array.from(
        $(this)
          .parent()
          .siblings(),
      );

      $siblings.forEach(el => {
        const $el = $(el);
        if ($el.hasClass('dropdown-item-submenu')) {
          const $dropdownItem = $el.find('.dropdown-item').first();

          if ($dropdownItem.hasClass('active')) {
            $dropdownItem.removeClass('active');
            $el.find('.dropdown-menu').hide();

            // remove active class to dropdown items
            self.$_removeActiveClass($el);
          }
        }
      });

      $(this).toggleClass('active');
      // togle (hide/show) dropdow nmenu
      const $menu = $(this).next();

      if ($menu) {
        $menu.toggle();
      }

      e.stopPropagation();
      e.preventDefault();
    });

    // hide event on multilevel dropdown
    $(`#${this.dropdownMixin_id}`).on('hide.bs.dropdown', function() {
      console.log('on hide');
      const $submenuContainer = $(this).find('.dropdown-item-submenu');
      // reset active state
      $submenuContainer.find('.dropdown-item').removeClass('active');

      // get submenus
      const $submenu = $submenuContainer.find('.dropdown-menu');
      // if it's visible, hide.
      $submenu.is(':visible') && $submenu.hide();
    });
  },

  methods: {
    /** remove active class to dropdown items **/
    $_removeActiveClass($el) {
      const $submenus = Array.from(
        $el.find('.dropdown-menu').find('.dropdown-item-submenu'),
      );

      if (!$submenus.length) {
        return;
      }

      $submenus.forEach(el => {
        const $el = $(el);
        const $dropdownItem = $el.find('.dropdown-item').first();

        if ($dropdownItem.hasClass('active')) {
          $dropdownItem.removeClass('active');
        }

        return removeActiveClass($el);
      });
    },
  },
};
