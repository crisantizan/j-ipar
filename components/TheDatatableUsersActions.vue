<template>
  <VDropdown multilevel>
    <VDropdownToggleButton class="btn btn-primary btn-sm">
      Actions
      <div class="arrow-down"></div>
    </VDropdownToggleButton>

    <VDropdownMenu align-right class="p-0" style="min-width: 190px;">
      <VDropdownMenuItem
        icon="user-edit"
        @click="onEditClick"
        :disabled="!user.active"
      >
        Edit
      </VDropdownMenuItem>

      <VDropdownMenuItem
        :icon="user.active ? 'thumbs-down' : 'thumbs-up'"
        :disabled="currentUser.id === user.id || (!user.active && coreIsFull)"
        @click="onDisableClick"
      >
        {{ user.active ? 'Disable' : 'Enable' }}
      </VDropdownMenuItem>

      <VDropdownMenuItem
        icon="key"
        @click="onResetPasswordClick"
        :disabled="!user.active"
      >
        Reset Password
      </VDropdownMenuItem>

      <VDropdownMenuItem
        icon="paper-plane"
        @click="onResendEmailClick"
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
          <VDropdownMenuItem :disabled="!user.admin">To user</VDropdownMenuItem>
          <VDropdownMenuItem :disabled="user.admin">To admin</VDropdownMenuItem>
        </VDropdownMenu>
      </VDropdownMenuItem>

      <VDropdownMenuItem
        icon="cogs"
        @click="onRelationsClick"
        :disabled="!user.active"
      >
        Relations
      </VDropdownMenuItem>
    </VDropdownMenu>
  </VDropdown>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { cloneObject } from '@/helpers/functions';

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

    async onDisableClick() {
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
    },

    async onResetPasswordClick() {
      try {
        await this.resetPassword(this.user.id);
        this.$toast.success('Password reset successfully!').goAway(1500);
      } catch (err) {
        this.$toast.error('Error while password reset.').goAway(1500);
        console.error(err);
      }
    },

    async onResendEmailClick() {
      try {
        await this.resendEmail(this.user.id);
        this.$toast.success('Email resend successfully!').goAway(1500);
      } catch (error) {
        this.$toast.error('Error while email resend.').goAway(1500);
        console.error(error);
      }
    },

    async onEditClick() {
      this.$emit('openmodal', {
        modal: 'edit-user',
        data: cloneObject(this.user),
      });
    },

    async onRelationsClick() {
      this.$emit('openmodal', {
        modal: 'relations',
        data: cloneObject(this.user),
      });
    },
  },
};
</script>
