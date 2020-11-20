<template>
  <div class="d-flex align-items-center" style="height: calc(100vh - 69.6px)">
    <datatable
      :columns="columns"
      :rows="showedUsers"
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

        <center>
          <span v-if="isLoginAgain">
            <h4 class="text-danger">
              After modifying user privileges, the user must re-login to Prima.
            </h4>
          </span>
        </center>
      </template>
      <!-- available libraries -->
      <template slot="header-right">
        <div class="d-flex">
          <div class="text-right">
            <div
              v-for="item of librariesCounter"
              :key="item.library"
              class="badge badge-pill badge-light text-success ml-1 d-block mb-no-last"
              :class="{ 'text-danger': item.isFull }"
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
        <template v-if="isTheColumn(props.column, 'firstName')">
          <span>{{ generateFullName(props.row) }}</span>
        </template>

        <!-- printo isAttorney checkbox -->
        <template v-else-if="isTheColumn(props.column, 'isAttorney')">
          <VCheckbox
            v-model="users[props.row.index].isAttorney"
            async
            color="dark"
            :id="generateCheckboxId('isAttorney', props.row.id)"
            :disabled="!props.row.active"
            class="d-flex justify-content-center"
            @change-async="
              onChangeIsAttorney({
                index: props.row.index,
                checked: $event,
              })
            "
          />
        </template>

        <!-- generate checkboxes in "assignLibraries" field -->
        <template v-else-if="isTheColumn(props.column, 'assignLibraries')">
          <!-- print only avaibales libraries -->
          <template
            v-for="(libraryValue, libraryKey) in props.row.assignLibraries"
          >
            <VCheckbox
              v-if="displayLibraryCheckbox(libraryKey)"
              v-model="users[props.row.index].assignLibraries[libraryKey]"
              async
              :id="generateCheckboxId(libraryKey, props.row.id)"
              :label="libraryKey"
              :key="libraryKey"
              :disabled="
                isDisabled(props.row.index, libraryKey) || !props.row.active
              "
              @change-async="
                onCheckedAsync({
                  checked: $event,
                  library: libraryKey,
                  index: props.row.index,
                })
              "
            />
          </template>
        </template>

        <!-- generate buttons in actions field -->
        <TheDatatableUsersActions
          v-else-if="isTheColumn(props.column, 'actions')"
          :row-props="props"
          :user="users[props.row.index]"
          :core-is-full="coreIsFull"
          @openmodal="fromActionsOpenModal"
        />

        <!-- print default data -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>
    </datatable>

    <!-- edit user modal -->
    <VModal v-model="modal.editUser" persistent>
      <VModalDialog>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit user data</h5>
            <VModalCloseButton />
          </div>
          <form v-if="selectedUser !== null" @submit.prevent="onUserEdit">
            <div class="modal-body">
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
      </VModalDialog>
    </VModal>

    <!-- relations modal -->
    <VModal v-model="modal.relations" persistent>
      <VModalDialog>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Relations</h5>
            <VModalCloseButton />
          </div>
          <div class="modal-body">
            <!-- MESSAGE ERROR -->
            <span v-if="messageErrorUsersIntegrations !== null">{{
              messageErrorUsersIntegrations
            }}</span>

            <div
              v-show="
                integrations && integrations !== null && integrations.length > 0
              "
              v-for="(integration, indexIntegration) in integrations"
              :key="indexIntegration"
            >
              <hr v-if="indexIntegration > 0" />

              <label>{{ integration.name }}</label>

              <!-- CLIO USERS -->

              <div
                v-for="(user, indexUser) in integration.users"
                :key="indexUser"
              >
                <span>
                  <input
                    type="checkbox"
                    name=""
                    :id="user.userId"
                    :checked="user.linked"
                    @click="
                      setRelation({
                        user,
                      })
                    "
                  />
                  <label :for="user.userId">
                    <small>{{ user.name }} {{ user.email }}</small>
                  </label>
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveRelations"
              :disabled="disabledBtnSaveRelationUser"
            >
              Save
            </button>
          </div>
        </div>
      </VModalDialog>
    </VModal>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { generateCheckboxHTML } from '@/helpers/generate-html';
import { cloneObject } from '@/helpers/functions';
import { libraryKeys } from '@/utils/constants';

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

      showDisabledUsers: false,

      selectedUser: null,

      userEditableProps: [
        // only firstName field is required
        { field: 'firstName', required: true },
        { field: 'middleName', required: false },
        { field: 'lastName', required: false },
      ],

      currentUser: null,

      disabledBtnSaveRelationUser: true,

      isLoginAgain: false,

      // show/hide modals
      modal: {
        editUser: false,
        relations: false,
      },
    };
  },

  computed: {
    ...mapGetters('users', [
      'users',
      'libraries',
      'selected',
      'librariesQuantity',
      'usersIntegrations',
      'integrations',
      'messageErrorUsersIntegrations',
    ]),

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
        ({ library }) => library === libraryKeys.CORE.key,
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
      'CHECK_RELATION',
    ]),

    ...mapActions('users', [
      'assignLibrary',
      'updateUser',
      'getUsersIntegrations',
      'updateUserRelations',
    ]),

    /** generate custom checkbox id */
    generateCheckboxId(library, id) {
      return `checkLib${library}${id}`;
    },

    /** verify if the current field is "target" and is not hidden */
    isTheColumn(column, field) {
      return column.field === field && !column.hidden;
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
    async onCheckedAsync({ checked, library, index }) {
      const user = this.users[index];

      try {
        // execute request
        await this.assignLibrary({
          userId: user.id,
          library: { [library]: checked },
        });

        // update ui
        this.SET_CHECKED({ checked, library, index });

        this.isLoginAgain = true;
      } catch (e) {
        console.error(e);
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

    /** open modals from "TheDatatableUsersActions" */
    async fromActionsOpenModal({ modal, data }) {
      switch (modal) {
        // edit user modal
        case 'edit-user':
          this.selectedUser = data;
          this.modal.editUser = true; // open modal
          break;

        // relations modal
        case 'relations':
          // get integrations & get integration users (iterate integrations)
          this.currentUser = data;

          await this.getUsersIntegrations({
            userId: this.currentUser.id,
          });

          this.modal.relations = true; // open modal
          break;
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
        await this.updateUser({
          index: this.selectedUser.index,
          userId: this.selectedUser.id,
          userData: newData,
        });

        // close modal
        this.modal.editUser = false;
      } catch (err) {
        console.error(err);
      }
    },

    setRelation(payload) {
      this.disabledBtnSaveRelationUser = false;

      this.CHECK_RELATION({
        userIntegrationId: payload.user.userId,
        linked: !payload.user.linked,
      });
    },

    async saveRelations() {
      let relationsToSave = [];

      this.usersIntegrations.forEach(user => {
        if (user.linked) {
          relationsToSave.push({
            integrationId: user.integrationId,
            userIntegrationId: user.userId,
            userPrimaId: this.currentUser.id,
          });
        }
      });

      // request to save relations graph
      await this.updateUserRelations({
        relations: relationsToSave,
      });

      this.modal.relations = false; // close modal
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
