<template>
  <client-only>
    <VDropdown multilevel>
      <VDropdownToggleButton>Holitas</VDropdownToggleButton>
      <VDropdownMenu>
        <VDropdownMenuItem>Item 1</VDropdownMenuItem>
        <VDropdownMenuItem submenu tag="div">
          <VDropdownMenuItem arrow-indicator>Item 2</VDropdownMenuItem>
          <VDropdownMenu>
            <VDropdownMenuItem>Subitem 1</VDropdownMenuItem>
            <VDropdownMenuItem>Subitem 2</VDropdownMenuItem>
          </VDropdownMenu>
        </VDropdownMenuItem>
        <VDropdownMenuItem>Item 3</VDropdownMenuItem>
      </VDropdownMenu>
    </VDropdown>
  </client-only>
</template>

<script>
export default {};
</script>

<style></style>
