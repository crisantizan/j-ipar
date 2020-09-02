<template>
  <div>
    <h1>Users</h1>
    <div class="card-box mt-2">
      <vue-datatable :columns="columns" :rows="users">
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
                :id="generateCheckboxId('isAttorney', props.formattedRow.id)"
                :value="libraryKey"
                :checked="isAttorneyChecked(props.row.originalIndex)"
                @change="
                  onChangeIsAttorney({
                    index: props.row.originalIndex,
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
                  :checked="isChecked(props.row.originalIndex, libraryKey)"
                  :disabled="isDisabled(props.row.originalIndex, libraryKey)"
                  @change="
                    onChange({
                      checked: $event.target.checked,
                      library: $event.target.value,
                      index: props.row.originalIndex,
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

              <div class="dropdown-menu p-0" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">
                  <i class="fas fa-cogs mr-1"></i>
                  Relations
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-paper-plane mr-1"></i>
                  Resend Email
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-thumbs-down mr-1"></i>
                  Disable
                </a>
              </div>
            </div>
          </template>

          <!-- print default data -->
          <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
        </template>
      </vue-datatable>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { generateCheckboxHTML } from '../helpers/generate-html';

export default {
  components: {
    VueDatatable: () => import('@/components/vue-datatable/Table'),
  },
  data: () => ({
    searchTerm: '',
    columns: [
      {
        field: 'id',
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
  }),
  computed: {
    ...mapGetters('users', [
      'users',
      'libraries',
      'selected',
      'librariesQuantity',
    ]),
  },
  methods: {
    ...mapMutations('users', ['SET_CHECKED', 'SET_IS_ATTORNEY_CHECKED']),
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

    onChange({ checked, library, index }) {
      this.SET_CHECKED({ checked, library, index });
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
  },
};
</script>
