$(document).ready(() => {
  // search form group
  const $formGroup = $('.search');

  // add search icon after input
  $formGroup.append(
    `<div class="btn btn-primary" style="cursor: default;">
      <i class="fa fa-search"></i>
    </div>`,
  );
});
