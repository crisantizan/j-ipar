<template>
  <div class="d-flex align-items-center" style="height: calc(100vh - 69.6px)">
    <datatable
      :columns="columns"
      :rows="showedUsers"
      :loading="datatableLoading"
      class="users-table"
      :pagination="{
        enabled: true,
        perPageDropdown: [5, 10, 15, 20, 50, 100],
        perPage: 100,
      }"
      :row-style-class="rowStyleClassFn"
    >
      <template slot="second-header">
        <div class="mb-2 d-flex align-items-end">
          <div
            class="custom-control custom-checkbox show-disabled-users-check ml-1"
          >
            <input
              type="checkbox"
              class="custom-control-input show-disabled-users-input"
              id="showDisabledUsers"
              v-model="showDisabledUsers"
            />
            <label class="custom-control-label" for="showDisabledUsers">
              Show disabled users
            </label>
          </div>
        </div>
      </template>
      <!-- available libraries -->
      <template slot="header-right">
        <div class="d-flex">
          <div class="text-right">
            <div
              v-for="item of librariesCounter"
              :key="item.library"
              class="badge badge-pill badge-light text-success ml-1 d-block mb-no-last"
              :class="{
                'text-danger': item.isFull,
              }"
              style="
                font-size: 14px;
                background: linear-gradient(#f4f5f8, #f1f3f6);
              "
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </template>
      <!-- end available libraries -->

      <!-- generate fullname -->
      <template slot="table-row" slot-scope="props">
        <template
          v-if="
            isTheColumn(props.column.field, 'firstName', props.column.hidden)
          "
        >
          <span>{{ generateFullName(props.formattedRow) }}</span>
        </template>

        <!-- printo isAttorney checkbox -->
        <template
          v-else-if="
            isTheColumn(props.column.field, 'isAttorney', props.column.hidden)
          "
        >
          <div
            class="custom-control custom-checkbox d-flex justify-content-center"
          >
            <input
              type="checkbox"
              class="custom-control-input"
              :disabled="!props.formattedRow.active"
              :id="generateCheckboxId('isAttorney', props.formattedRow.id)"
              :checked="isAttorneyChecked(props.row.index)"
              @change="
                onChangeIsAttorney({
                  index: props.row.index,
                  checked: $event.target.checked,
                })
              "
            />
            <label
              class="custom-control-label d-flex align-items-center"
              :for="generateCheckboxId('isAttorney', props.formattedRow.id)"
            >
            </label>
          </div>
        </template>

        <!-- generate checkboxes in "assignLibraries" field -->
        <template
          v-else-if="
            isTheColumn(
              props.column.field,
              'assignLibraries',
              props.column.hidden,
            )
          "
        >
          <!-- print only avaibales libraries -->
          <template
            v-for="(libraryValue, libraryKey) in props.formattedRow
              .assignLibraries"
          >
            <div
              :key="libraryKey"
              class="custom-control custom-checkbox d-flex"
              v-if="displayLibraryCheckbox(libraryKey)"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                :id="generateCheckboxId(libraryKey, props.formattedRow.id)"
                :value="libraryKey"
                :checked="isChecked(props.row.index, libraryKey)"
                :disabled="
                  isDisabled(props.row.index, libraryKey) ||
                  !props.formattedRow.active
                "
                @change="
                  onChange({
                    checked: $event.target.checked,
                    library: $event.target.value,
                    index: props.row.index,
                  })
                "
              />
              <label
                class="custom-control-label d-flex align-items-center"
                :for="generateCheckboxId(libraryKey, props.formattedRow.id)"
              >
                {{ libraryKey }}
              </label>
            </div>
          </template>
        </template>

        <!-- generate buttons in actions field -->
        <template
          v-else-if="
            isTheColumn(props.column.field, 'actions', props.column.hidden)
          "
        >
          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle btn-sm"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Actions
              <div class="arrow-down"></div>
            </button>

            <div
              class="dropdown-menu dropdown-menu-right p-0"
              aria-labelledby="dropdownMenuButton"
            >
              <a
                v-for="action in userActions"
                :key="action.action"
                class="dropdown-item"
                href="#"
                :class="{
                  disabled: dropdownActionItemIsDisabled(
                    action.action,
                    props.formattedRow.active,
                    props.formattedRow.id,
                  ),
                }"
                @click="
                  onClickAction({
                    action: action.action,
                    index: props.row.index,
                  })
                "
                v-bind="bindModalProps(action.action)"
              >
                <i
                  :class="[
                    dropdownActionItemPrintIcon(
                      action.icon,
                      action.action,
                      props.formattedRow.active,
                    ),
                    'mr-1',
                  ]"
                ></i>
                {{
                  dropdownActionItemPrintLabel(
                    action.label,
                    action.action,
                    props.formattedRow.active,
                  )
                }}
              </a>
            </div>
          </div>
        </template>

        <!-- print default data -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </datatable>

    <!-- Modal -->
    <div
      class="modal fade"
      id="editUserModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="editUserModalLabel"
      aria-hidden="true"
      data-backdrop="static"
      ref="modal"
    >
      <div class="modal-dialog" role="document" v-if="!!selectedUser">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editUserModalLabel">Edit user data</h5>
            <button
              type="button"
              class="close custom-close-modal"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="onUserEdit">
            <div class="modal-body">
              <!-- <pre>Disabled: {{ disabledBtnEditUser }}</pre> -->
              <!-- <pre>{{ selectedUser }}</pre> -->
              <div class="form-group">
                <input
                  v-model="selectedUser.firstName"
                  type="text"
                  class="form-control"
                  placeholder="First name"
                  required
                />
              </div>

              <div class="form-group">
                <input
                  v-model="selectedUser.middleName"
                  type="text"
                  class="form-control"
                  placeholder="Middle name"
                />
              </div>

              <div class="form-group">
                <input
                  v-model="selectedUser.lastName"
                  type="text"
                  class="form-control"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div class="modal-footer">
              <!-- data-dismiss="modal" -->
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="disabledBtnEditUser"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { generateCheckboxHTML } from '@/helpers/generate-html';
import { cloneObject } from '@/helpers/utils';

export default {
  components: {
    Datatable: () => import('@/components/Table'),
  },

  data() {
    const self = this;

    return {
      searchTerm: '',
      columns: [
        {
          field: 'id',
          hidden: true,
        },

        {
          field: 'index',
          hidden: true,
        },

        {
          field: 'active',
          hidden: true,
        },

        {
          field: 'lastName',
          hidden: true,
        },

        {
          field: 'middleName',
          hidden: true,
        },

        {
          field: 'firstName',
          label: 'Name',
          hidden: false,
          toggle: true,
        },

        { field: 'email', label: 'Email', hidden: false, toggle: true },

        {
          field: 'admin',
          label: 'Role',
          hidden: false,
          toggle: true,
          type: 'boolean',
          tdClass: 'text-left',
          thClass: 'text-left',
          formatFn: isAdmin => (isAdmin ? 'Admin' : 'User'),
        },

        {
          field: 'isAttorney',
          label: 'Is Attorney',
          sortable: false,
          hidden: false,
          toggle: true,
          type: 'boolean',
          thClass: 'text-center',
        },

        {
          field: 'assignLibraries',
          label: 'Libraries',
          sortable: false,
          toggle: true,
          hidden: false,
        },

        {
          field: 'actions',
          sortable: false,
          hidden: false,
          toggle: true,
          label: 'Actions',
        },
      ],
      userActions: [
        {
          action: 'edit',
          label: 'Edit',
          icon: 'fas fa-user-edit',
        },

        {
          action: 'disable',
          label: 'Disable',
          icon: 'fas fa-thumbs-down',
        },

        {
          action: 'resetPassword',
          label: 'Reset Password',
          icon: 'fas fa-key',
        },

        {
          action: 'resendEmail',
          label: 'Resend Email',
          icon: 'fas fa-paper-plane',
        },

        {
          action: 'relations',
          label: 'Relations',
          icon: 'fas fa-cogs',
        },
      ],
      showDisabledUsers: false,

      datatableLoading: false,
      selectedUser: null,
      userEditableProps: [
        // only firstName field is required
        { field: 'firstName', required: true },
        { field: 'middleName', required: false },
        { field: 'lastName', required: false },
      ],
    };
  },

  computed: {
    ...mapGetters('users', [
      'users',
      'libraries',
      'selected',
      'librariesQuantity',
    ]),

    ...mapGetters(['user']),

    showedUsers() {
      // show only actived users
      if (!this.showDisabledUsers) {
        return this.users.filter(user => user.active);
      }

      // show all
      return this.users;
    },

    /** data for generate counter labels **/
    librariesCounter() {
      const arr = [];

      for (const key in this.libraries) {
        arr.push({
          library: key,
          isFull: this.selected[key] === this.librariesQuantity[key],
          label: `${this.selected[key]}/${this.librariesQuantity[key]} ${key}`,
        });
      }

      return arr;
    },

    /** indicates if «Prima Facie» library is full **/
    coreIsFull() {
      if (!this.librariesCounter.length) {
        return false;
      }

      return this.librariesCounter.find(
        ({ library }) => library === 'Prima Facie',
      ).isFull;
    },

    /** disable button in edit user modal **/
    disabledBtnEditUser() {
      if (!this.selectedUser) {
        return true;
      }

      for (const prop of this.userEditableProps) {
        // field value in datatable
        const columnPropValue = this.users[this.selectedUser.index][prop.field];
        // field value in modal edit user
        const propValue = this.selectedUser[prop.field];

        // current value is different to datatable
        if (columnPropValue !== propValue) {
          // field is required but his current value is empty
          if (prop.required && propValue === '') return true;
          // field in datatables was empty y is now too
          if (columnPropValue === null && propValue === '') continue;

          return false;
        }
      }

      return true;
    },
  },

  methods: {
    ...mapMutations('users', [
      'SET_CHECKED',
      'SET_IS_ATTORNEY_CHECKED',
      'SET_ACTIVE',
    ]),

    ...mapActions('users', [
      'assignLibrary',
      'updateState',
      'resetPassword',
      'resendEmail',
      'updateUser',
    ]),

    /** generate custom checkbox id */
    generateCheckboxId(library, id) {
      return `checkLib${library}${id}`;
    },

    /** verify if the current field is "target" and is not hidden */
    isTheColumn(current, target, hidden) {
      return current === target && !hidden;
    },

    /** generate full name */
    generateFullName({ firstName, lastName, middleName }) {
      // name and lastname
      if (lastName !== '-') {
        return `${firstName} ${lastName}`;
      }

      // firstname only
      if (!lastName === '-' && !middleName === '-') {
        return firstName;
      }

      // name and middle name or only first name
      return middleName !== '-' ? `${firstName} ${middleName}` : firstName;
    },

    /** checboxe «libraries» change event **/
    async onChange({ checked, library, index }) {
      const user = this.users[index];

      try {
        this.datatableLoading = true;
        // execute request
        await this.assignLibrary({
          userId: user.id,
          library: { [library]: checked },
        });
        // update ui
        this.SET_CHECKED({ checked, library, index });
      } catch (e) {
        console.error(e);
      } finally {
        this.datatableLoading = false;
      }
    },

    onChangeIsAttorney(data) {
      // data: { index, checked }
      this.SET_IS_ATTORNEY_CHECKED(data);
    },

    isChecked(index, key) {
      return this.users[index].assignLibraries[key];
    },

    isAttorneyChecked(index) {
      return this.users[index].isAttorney;
    },

    isDisabled(index, key) {
      return (
        this.selected[key] >= this.librariesQuantity[key] &&
        !this.isChecked(index, key)
      );
    },

    displayLibraryCheckbox(key) {
      return Object.keys(this.libraries).includes(key);
    },

    rowStyleClassFn(row) {
      return row.active ? '' : 'disabled';
    },

    /** on click user action **/
    async onClickAction({ action, index }) {
      const user = this.users[index];

      switch (action) {
        case 'disable':
          try {
            this.datatableLoading = true;

            let libraries = null;

            // disabled
            if (user.active) {
              // clear libraries
              Object.keys(user.assignLibraries).forEach(key => {
                // if true set to false
                if (user.assignLibraries[key]) {
                  if (libraries === null) {
                    libraries = {};
                  }

                  libraries[key] = false;
                }
              });
            }

            // execute request
            await this.updateState({
              userId: user.id,
              active: !user.active,
              libraries,
            });

            // clear libraries in UI
            if (user.active) {
              Object.keys(user.assignLibraries).forEach(key => {
                // if true set to false
                if (user.assignLibraries[key]) {
                  this.SET_CHECKED({ checked: false, library: key, index });
                }
              });
            }

            this.SET_ACTIVE({ index: index, value: !user.active });
          } catch (e) {
            console.error(e);
          } finally {
            this.datatableLoading = false;
          }
          break;

        case 'resetPassword':
          try {
            this.datatableLoading = true;

            // execute request
            await this.resetPassword(user.id);
          } catch (err) {
            console.error(err);
          } finally {
            this.datatableLoading = false;
          }

          break;

        case 'resendEmail':
          try {
            this.datatableLoading = true;

            // execute request
            await this.resendEmail(user.id);
          } catch (err) {
            console.error(err);
          } finally {
            this.datatableLoading = false;
          }
          break;

        case 'edit':
          this.selectedUser = cloneObject(user);
          break;

        default:
          console.log(action);
      }
    },

    /** edit user modal submit event **/
    async onUserEdit() {
      if (this.disabledBtnEditUser) return;

      const columnUser = this.users[this.selectedUser.index];

      // get only changed data
      const newData = Object.keys(this.selectedUser).reduce((obj, key) => {
        // current prop is not editable
        if (this.userEditableProps.every(val => val.field !== key)) {
          return obj;
        }

        // current prop has been changed
        if (columnUser[key] !== this.selectedUser[key]) {
          // field in datatables was empty y is now too
          if (columnUser[key] === null && this.selectedUser[key] === '') {
            return obj;
          }

          return { ...obj, [key]: this.selectedUser[key] };
        }

        return obj;
      }, {});

      try {
        this.datatableLoading = true;
        await this.updateUser({
          index: this.selectedUser.index,
          userId: this.selectedUser.id,
          userData: newData,
        });

        // close modal
        this.$refs.modal.querySelector('.custom-close-modal').click();
      } catch (err) {
        console.error(err);
      } finally {
        this.datatableLoading = false;
      }
    },

    /* disable dropdown actions items */
    dropdownActionItemIsDisabled(action, isActive, userId) {
      if (this.user.id === userId && action === 'disable') {
        return true;
      }

      if (this.coreIsFull && action === 'disable' && !isActive) {
        return true;
      }

      return action !== 'disable' && !isActive;
    },

    /* print text in dropdown actions items */
    dropdownActionItemPrintLabel(label, action, isActive) {
      if (action !== 'disable') {
        return label;
      }

      return isActive ? label : 'Enable';
    },

    /* print icon in dropdown actions items */
    dropdownActionItemPrintIcon(icon, action, isActive) {
      if (action !== 'disable') {
        return icon;
      }

      return isActive ? icon : 'fas fa-thumbs-up';
    },

    /** bind modal properties in "Edit" item **/
    bindModalProps(action) {
      if (action !== 'edit') {
        return {};
      }

      return { 'data-toggle': 'modal', 'data-target': '#editUserModal' };
    },
  },
};
</script>

<style scoped>
.mb-no-last:not(:last-child) {
  margin-bottom: 0.3rem;
}

.show-disabled-users-check
  .custom-control-input:checked
  ~ .custom-control-label {
  color: rgba(0, 0, 0, 0.5);
}

.show-disabled-users-check .custom-control-label {
  color: rgba(0, 0, 0, 0.3);
}
</style>
