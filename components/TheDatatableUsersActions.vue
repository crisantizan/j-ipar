<template>
  <VDropdown multilevel>
    <VDropdownToggleButton class="btn btn-primary btn-sm">
      Actions
      <div class="arrow-down"></div>
    </VDropdownToggleButton>

    <VDropdownMenu align-right class="p-0" style="min-width: 190px;">
      <VDropdownMenuItem
        icon="user-edit"
        @click="onAction('edit')"
        :disabled="!user.active"
      >
        Edit
      </VDropdownMenuItem>

      <VDropdownMenuItem
        :icon="user.active ? 'thumbs-down' : 'thumbs-up'"
        :disabled="currentUser.id === user.id"
        @click="onAction('disable')"
      >
        {{ user.active ? 'Disable' : 'Enable' }}
      </VDropdownMenuItem>

      <VDropdownMenuItem
        icon="key"
        @click="onAction('resetPassword')"
        :disabled="!user.active"
      >
        Reset Password
      </VDropdownMenuItem>

      <VDropdownMenuItem
        icon="paper-plane"
        @click="onAction('resendEmail')"
        :disabled="!user.active"
      >
        Resend Email
      </VDropdownMenuItem>

      <!-- submenu -->
      <VDropdownMenuItem submenu tag="div">
        <VDropdownMenuItem
          icon="user-tag"
          arrow-indicator
          :disabled="!user.active"
        >
          Change Role
        </VDropdownMenuItem>
        <VDropdownMenu class="p-0" pull-left>
          <VDropdownMenuItem>User</VDropdownMenuItem>
          <VDropdownMenuItem>Admin</VDropdownMenuItem>
        </VDropdownMenu>
      </VDropdownMenuItem>

      <VDropdownMenuItem
        icon="cogs"
        @click="onAction('relations')"
        :disabled="!user.active"
      >
        Relations
      </VDropdownMenuItem>
    </VDropdownMenu>
  </VDropdown>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';

export default {
  props: {
    rowProps: {
      type: Object,
      required: true,
    },

    user: {
      type: Object,
      required: true,
    },

    coreIsFull: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    index() {
      return this.rowProps.row.index;
    },

    ...mapGetters({ currentUser: 'user' }),
  },

  methods: {
    ...mapMutations('users', ['SET_CHECKED', 'SET_ACTIVE']),
    ...mapActions('users', ['updateState', 'resetPassword', 'resendEmail']),

    async onAction(action) {
      switch (action) {
        case 'disable':
          try {
            let libraries = null;

            // disabled
            if (this.user.active) {
              const { isConfirmed } = await Swal.fire({
                title: 'Are you sure you want to disable this user?',
                text: `They will immediately lose access to Prima.
                You will be able to reassign their license to another user immediately.
                This does not cancel your subscription.  If you desire to cancel or modify your subscription, you must do so from the "Subscription" section of the administrator panel.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, do it!',
              });

              if (!isConfirmed) {
                return;
              }

              // clear libraries
              Object.keys(this.user.assignLibraries).forEach(key => {
                // if true set to false
                if (this.user.assignLibraries[key]) {
                  if (libraries === null) {
                    libraries = {};
                  }

                  libraries[key] = false;
                }
              });
            }

            // execute request
            await this.updateState({
              userId: this.user.id,
              active: !this.user.active,
              libraries,
            });

            // clear libraries in UI
            if (this.user.active) {
              Object.keys(this.user.assignLibraries).forEach(key => {
                // if true set to false
                if (this.user.assignLibraries[key]) {
                  this.SET_CHECKED({
                    checked: false,
                    library: key,
                    index: this.index,
                  });
                }
              });
            }

            this.SET_ACTIVE({ index: this.index, value: !this.user.active });
          } catch (e) {
            console.error(e);
          }
          break;

        case 'resetPassword':
          try {
            // execute request
            await this.resetPassword(this.user.id);
          } catch (err) {
            console.error(err);
          }

          break;

        case 'resendEmail':
          try {
            // execute request
            await this.resendEmail(this.user.id);
          } catch (err) {
            console.error(err);
          }
          break;

        case 'edit':
          this.selectedUser = cloneObject(user);
          break;

        case 'relations':
          // GET INTEGRATIONS && GET INTEGRATION USERS (ITERATE INTEGRATIONS)
          this.$emit('currentUser', this.user);

          this.getUsersIntegrations({
            userId: this.user.id,
          });
          break;

        default:
          console.log(action);
      }
    },

    /** bind modal properties in "Edit" item **/
    bindModalProps(action) {
      if (action === 'relations') {
        return { 'data-toggle': 'modal', 'data-target': '#relationsModal' };
      }

      if (action !== 'edit') {
        return {};
      }

      return { 'data-toggle': 'modal', 'data-target': '#editUserModal' };
    },
  },
};
</script>
