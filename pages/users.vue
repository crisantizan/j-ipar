<template>
  <div class="d-flex align-items-center mt-2">
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
        <div class="mb-2 d-flex justify-content-end">
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-sm btn-info"
              @click="
                fromActionsOpenModal({
                  modal: 'invite-user',
                })
              "
            >
              Invite new user
            </button>
            <button
              type="button"
              class="btn btn-sm btn-primary"
              @click="showDisabledUsers = !showDisabledUsers"
            >
              {{ !showDisabledUsers ? 'Show' : 'Hide' }} disabled users
            </button>
          </div>
        </div>

        <span v-if="isLoginAgain" class="message-re-login">
          <h4 class="text-danger">
            After modifying user privileges, the user must re-login to Prima.
          </h4>
        </span>
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
          <template v-for="(libraryValue, libraryKey) in props.row.assignLibraries">
            <VCheckbox
              v-if="displayLibraryCheckbox(libraryKey)"
              v-model="users[props.row.index].assignLibraries[libraryKey]"
              async
              :id="generateCheckboxId(libraryKey, props.row.id)"
              :label="libraryKey"
              :key="libraryKey"
              :disabled="isDisabled(props.row.index, libraryKey) || !props.row.active"
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

    <client-only>
      <!-- edit user modal -->
      <VModal v-model="modal.editUser" persistent>
        <VModalDialog class="modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Edit user data</h3>
              <VModalCloseButton />
            </div>
            <form v-if="selectedUser !== null" @submit.prevent="onUserEdit">
              <div class="modal-body">
                <div class="row">
                  <div class="col-lg-4 form-group">
                    <label for="firstName">First Name</label>
                    <input
                      v-model="selectedUser.firstName"
                      id="firstName"
                      type="text"
                      class="form-control"
                      placeholder="First Name"
                      :required="editUserInputRequired('firstName')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="lastName">Last Name</label>
                    <input
                      v-model="selectedUser.lastName"
                      id="lastName"
                      type="text"
                      class="form-control"
                      placeholder="Last Name"
                      :required="editUserInputRequired('lastName')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="middleName">Middle Name</label>
                    <input
                      v-model="selectedUser.middleName"
                      id="middleName"
                      type="text"
                      class="form-control"
                      placeholder="Middle Name"
                      :required="editUserInputRequired('middleName')"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4 form-group">
                    <label for="phone">Phone</label>
                    <input
                      v-model="selectedUser.phone"
                      id="phone"
                      type="text"
                      class="form-control"
                      placeholder="Phone"
                      :required="editUserInputRequired('phone')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="mobilePhone">Mobile Phone</label>
                    <input
                      v-model="selectedUser.mobilePhone"
                      id="mobilePhone"
                      type="text"
                      class="form-control"
                      placeholder="Mobile Phone"
                      :required="editUserInputRequired('mobilePhone')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="fax">Fax</label>
                    <input
                      v-model="selectedUser.fax"
                      id="fax"
                      type="text"
                      class="form-control"
                      placeholder="Fax"
                      :required="editUserInputRequired('fax')"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4 form-group">
                    <label for="address">Address</label>
                    <input
                      v-model="selectedUser.address"
                      id="address"
                      type="text"
                      class="form-control"
                      placeholder="Address"
                      :required="editUserInputRequired('address')"
                    />
                  </div>

                  <!-- TODO:: unknow field name -->
                  <div
                    class="col-lg-4 form-group d-flex flex-column align-items-center justify-content-end"
                  >
                    <div class="d-flex mb-1">
                      <VCheckbox label="APT" class="mr-2" id="addressAptCk" />
                      <VCheckbox label="STE" class="mr-2" id="addressSteCk" />
                      <VCheckbox label="FLOOR" id="addressFloork" />
                    </div>
                    <input type="text" class="form-control" />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="city">City</label>
                    <input
                      v-model="selectedUser.city"
                      id="city"
                      type="text"
                      class="form-control"
                      placeholder="City"
                      :required="editUserInputRequired('city')"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4 form-group">
                    <label for="state">State</label>
                    <input
                      v-model="selectedUser.state"
                      id="state"
                      type="text"
                      class="form-control"
                      placeholder="State"
                      :required="editUserInputRequired('state')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="zipCode">Zip Code</label>
                    <input
                      v-model="selectedUser.zipCode"
                      id="zipCode"
                      type="text"
                      class="form-control"
                      placeholder="Zip Code"
                      :required="editUserInputRequired('zipCode')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="foreignProvince">Foreign Province</label>
                    <input
                      v-model="selectedUser.foreignProvince"
                      id="foreignProvince"
                      type="text"
                      class="form-control"
                      placeholder="Foreign Province"
                      :required="editUserInputRequired('foreignProvince')"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4 form-group">
                    <label for="foreignPostalCode">Foreign Postal Code</label>
                    <input
                      v-model="selectedUser.foreignPostalCode"
                      id="foreignPostalCode"
                      type="text"
                      class="form-control"
                      placeholder="Foreign Postal Code"
                      :required="editUserInputRequired('foreignPostalCode')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="country">Country</label>
                    <input
                      v-model="selectedUser.country"
                      id="country"
                      type="text"
                      class="form-control"
                      placeholder="Country"
                      :required="editUserInputRequired('country')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="eoir">EOIR</label>
                    <input
                      v-model="selectedUser.eoir"
                      id="eoir"
                      type="text"
                      class="form-control"
                      placeholder="EOIR"
                      :required="editUserInputRequired('eoir')"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4 form-group">
                    <label for="licencingAuthority">Licencing Authority</label>
                    <input
                      v-model="selectedUser.licencingAuthority"
                      id="licencingAuthority"
                      type="text"
                      class="form-control"
                      placeholder="Licencing Authority"
                      :required="editUserInputRequired('licencingAuthority')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="barNumber">Bar Number</label>
                    <input
                      v-model="selectedUser.barNumber"
                      id="barNumber"
                      type="text"
                      class="form-control"
                      placeholder="Bar Number"
                      :required="editUserInputRequired('barNumber')"
                    />
                  </div>

                  <div class="col-lg-4 form-group">
                    <label for="lawFirmName">Law Firm Name</label>
                    <input
                      v-model="selectedUser.lawFirmName"
                      :disabled="!selectedUser.admin"
                      id="lawFirmName"
                      type="text"
                      class="form-control"
                      placeholder="Law Firm Name"
                      :required="editUserInputRequired('lawFirmName')"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-4 form-group">
                    <label for="uscisElis">USCIS ELIS</label>
                    <input
                      v-model="selectedUser.uscisElis"
                      id="uscisElis"
                      type="text"
                      class="form-control"
                      placeholder="USCIS ELIS"
                      :required="editUserInputRequired('uscisElis')"
                    />
                  </div>
                </div>

                <!-- <div class="form-group">
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
                </div> -->

                <!-- <div class="form-group">
                  <input
                    id="txtEditEmail"
                    v-model="selectedUser.email"
                    type="text"
                    class="form-control"
                    placeholder="Email"
                    @input="removeInvalid"
                  />

                  <small v-if="validateMessage !== null" class="text-danger">{{
                    validateMessage
                  }}</small>
                </div> -->
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary" :disabled="disabledBtnEditUser">
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
              <!-- message error -->
              <span v-if="messageErrorUsersIntegrations !== null">{{
                messageErrorUsersIntegrations
              }}</span>

              <div
                v-show="integrations && integrations !== null && integrations.length > 0"
                v-for="(integration, indexIntegration) in integrations"
                :key="indexIntegration"
              >
                <hr v-if="indexIntegration > 0" />

                <label>{{ integration.name }}</label>

                <!-- clio users -->
                <div v-for="(user, indexUser) in integration.users" :key="indexUser">
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
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
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

      <!-- invite user modal -->
      <VModal v-model="modal.inviteUser" persistent>
        <VModalDialog>
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Invite User</h5>
              <VModalCloseButton />
            </div>
            <div class="modal-body">
              <div class="form-group">
                <input
                  id="inviteEmail"
                  class="form-control"
                  v-model="inviteEmail"
                  placeholder="Email"
                  type="text"
                />

                <small v-if="validateMessage !== null" class="text-danger">{{
                  validateMessage
                }}</small>
              </div>

              <div class="form-group">
                <input
                  class="form-control"
                  v-model="inviteFirstName"
                  placeholder="First Name"
                  type="text"
                />
              </div>

              <div class="form-group">
                <input
                  class="form-control"
                  v-model="inviteLastName"
                  placeholder="Last Name"
                  type="text"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="inviteUser"
                :disabled="disabledBtnInviteUser"
              >
                Invite
              </button>
            </div>
          </div>
        </VModalDialog>
      </VModal>
    </client-only>
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
        { field: 'firstName', required: true },
        { field: 'middleName', required: false },
        { field: 'lastName', required: false },
        { field: 'phone', required: false },
        { field: 'mobilePhone', required: false },
        { field: 'fax', required: false },
        { field: 'address', required: false },
        // { field: 'addressAptCk', required: false },
        // { field: 'addressSteCk', required: false },
        // { field: 'addressFloork', required: false },
        { field: 'city', required: false },
        { field: 'state', required: false },
        { field: 'zipCode', required: false },
        { field: 'foreignProvince', required: false },
        { field: 'foreignPostalCode', required: false },
        { field: 'country', required: false },
        { field: 'eoir', required: false },
        { field: 'licensingAuthority', required: false },
        { field: 'barNumber', required: false },
        { field: 'lawFirmName', required: false },
        { field: 'uscisElis', required: false },
      ],

      userForRelation: null,

      disabledBtnSaveRelationUser: true,

      isLoginAgain: false,

      // show/hide modals
      modal: {
        editUser: false,
        relations: false,
        inviteUser: false,
      },

      inviteEmail: null,
      inviteFirstName: null,
      inviteLastName: null,
      validateMessage: null,
    };
  },

  watch: {
    inviteEmail(val) {
      this.validateMessage = null;
      document.getElementById('inviteEmail').classList.remove('is-invalid');
    },
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

    ...mapGetters('tenant', ['tenant']),

    ...mapGetters({ currentUser: 'user' }),

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

      return this.librariesCounter.find(({ library }) => library === libraryKeys.CORE.key).isFull;
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
          if (prop.required && propValue.trim() === '') return true;
          // field in datatables was empty y is now too
          if (columnPropValue === null && propValue === '') continue;

          return false;
        }
      }

      return true;
    },

    disabledBtnInviteUser() {
      const values = [
        this.inviteEmail,
        this.inviteEmail,
        this.inviteFirstName,
        this.inviteFirstName,
        this.inviteLastName,
        this.inviteLastName,
      ];

      return values.some(v => v === '' || v === null);
    },
  },

  created() {
    this.getUsers();
  },

  methods: {
    ...mapMutations('users', ['SET_CHECKED', 'SET_IS_ATTORNEY_CHECKED', 'CHECK_RELATION']),

    ...mapActions('users', [
      'assignLibrary',
      'updateUser',
      'getUsersIntegrations',
      'updateUserRelations',
      // 'checkUserEmailExist',
      'adminInviteUser',
      'getUsers',
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

        if (this.currentUser.id === user.id) this.isLoginAgain = true;
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
      return this.selected[key] >= this.librariesQuantity[key] && !this.isChecked(index, key);
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
          this.userForRelation = data;

          await this.getUsersIntegrations({
            userId: this.userForRelation.id,
          });

          this.modal.relations = true; // open modal
          break;

        // invite new user modal
        case 'invite-user':
          this.modal.inviteUser = true; // open modal
          break;
      }
    },

    /** edit user modal submit event **/
    async onUserEdit() {
      if (this.disabledBtnEditUser) return;

      // validate email
      // if (!this.validateUserEmail(this.selectedUser.email)) {
      //   document.getElementById('txtEditEmail').classList.add('is-invalid');

      //   this.validateMessage = 'Invalid Email.';

      //   return;
      // } else document.getElementById('txtEditEmail').classList.remove('is-invalid');

      // // verify if exist email
      // if (columnUser.email !== this.selectedUser.email) {
        //   let existEmail = await this.existUserEmail(this.selectedUser.email);

      //   if (existEmail) {
        //     document.getElementById('txtEditEmail').classList.add('is-invalid');

      //     this.validateMessage =
      //       'This email address is already associated with a PrimaFacie account.  Please contact support at help.primafacienow.com or (616) 298-8695 so we can disable the other account or please choose another email address to use.';

      //     return;
      //   }
      // }

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

      console.log(newData);
      return;

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
            userPrimaId: this.userForRelation.id,
          });
        }
      });

      // request to save relations graph
      await this.updateUserRelations({
        relations: relationsToSave,
      });

      this.modal.relations = false; // close modal
    },

    removeInvalid() {
      document.getElementById('txtEditEmail').classList.remove('is-invalid');
      this.validateMessage = null;
    },

    validateUserEmail(email) {
      // validate email
      const regex = new RegExp(
        '^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$',
      );
      return regex.test(email);
    },

    // async existUserEmail(email) {
    //   // IF EXIST EMAIL
    //   let existEmail = false;

    //   await this.checkUserEmailExist(email).then(response => {
    //     if (response === 1) existEmail = true;
    //     else if (response === 0) existEmail = false;
    //   });

    //   return existEmail;
    // },

    async inviteUser() {
      // VALIDATE EMAIL

      if (!this.validateUserEmail(this.inviteEmail)) {
        document.getElementById('inviteEmail').classList.add('is-invalid');

        this.validateMessage = 'Invalid Email.';

        return;
      } else document.getElementById('inviteEmail').classList.remove('is-invalid');

      // IF EXIST EMAIL
      let existEmail = await this.existUserEmail(this.inviteEmail);

      if (existEmail) {
        document.getElementById('inviteEmail').classList.add('is-invalid');

        this.validateMessage =
          'This email address is already associated with a PrimaFacie account.  Please contact support at help.primafacienow.com or (616) 298-8695 so we can disable the other account or please choose another email address to use.';
      } else {
        // INVITE USER

        this.adminInviteUser({
          email: this.inviteEmail,
          firstName: this.inviteFirstName,
          lastName: this.inviteLastName,
          tenant: this.tenant,
        }).then(responseInvite => {
          if (responseInvite === 'ok') {
            this.$toast
              .success('User invited.!', {
                position: 'top-center',
              })
              .goAway(1500);
          } else {
            this.$toast
              .error(responseInvite, {
                position: 'top-center',
              })
              .goAway(1500);
          }

          this.modal.inviteUser = false; // close modal
          this.inviteEmail = null;
          this.inviteFirstName = null;
          this.inviteLastName = null;

          this.getUsers();
        });
      }
    },

    editUserInputRequired(fieldName) {
      const value = this.userEditableProps.find(v => v.field === fieldName);

      return !!value && value.required;
    }
  },
};
</script>

<style scoped>
.mb-no-last:not(:last-child) {
  margin-bottom: 0.3rem;
}

.show-disabled-users-check .custom-control-input:checked ~ .custom-control-label {
  color: rgba(0, 0, 0, 0.5);
}

.show-disabled-users-check .custom-control-label {
  color: rgba(0, 0, 0, 0.3);
}

.message-re-login {
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translate(-50%, 0%);
}
</style>
