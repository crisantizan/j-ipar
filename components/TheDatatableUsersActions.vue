<template>
  <VDropdown multilevel>
    <VDropdownToggleButton class="btn btn-primary btn-sm">
      Actions
      <div class="arrow-down"></div>
    </VDropdownToggleButton>

    <VDropdownMenu align-right class="p-0" style="min-width: 190px;">
      <VDropdownMenuItem icon="user-edit" @click="onAction('edit')">
        Edit
      </VDropdownMenuItem>

      <VDropdownMenuItem icon="thumbs-down" @click="onAction('disable')">
        Disable
      </VDropdownMenuItem>

      <VDropdownMenuItem icon="key" @click="onAction('resetPassword')">
        Reset Password
      </VDropdownMenuItem>

      <VDropdownMenuItem icon="paper-plane" @click="onAction('resendEmail')">
        Resend Email
      </VDropdownMenuItem>

      <!-- submenu -->
      <VDropdownMenuItem submenu tag="div">
        <VDropdownMenuItem icon="user-tag" arrow-indicator>
          Change Role
        </VDropdownMenuItem>
        <VDropdownMenu class="p-0" pull-left>
          <VDropdownMenuItem>User</VDropdownMenuItem>
          <VDropdownMenuItem>Admin</VDropdownMenuItem>
        </VDropdownMenu>
      </VDropdownMenuItem>

      <VDropdownMenuItem icon="cogs" @click="onAction('relations')">
        Relations
      </VDropdownMenuItem>
    </VDropdownMenu>
  </VDropdown>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
  },

  methods: {
    onAction(action) {
      console.log({ action, index: this.index });
    },
  },
};
</script>
