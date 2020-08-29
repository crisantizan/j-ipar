/** generate checkbox element */
export const generateCheckboxHTML = (id, label, checked) => {
  return `
    <div class="custom-control custom-checkbox d-flex">
      <input
        type="checkbox"
        class="custom-control-input"
        id="checkLib${id}"
        value="${label}"
        ${checked && 'checked'}
      >
      <label
        class="custom-control-label d-flex align-items-center"
        for="checkLib${id}">
          ${label}
      </label>
    </div>`;
};
