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
        field: 'assignLibraries',
        label: 'Libraries',
        sortable: false,
        toggle: true,
        hidden: false,
      },
    ],
  }),
  computed: {
    ...mapGetters('users', ['users', 'libraries', 'selected']),
  },
  methods: {
    ...mapMutations('users', ['SET_CHECKED']),
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

    isChecked(index, key) {
      return this.users[index].assignLibraries[key];
    },

    isDisabled(index, key) {
      return this.selected[key] >= 3 && !this.isChecked(index, key);
    },

    displayLibraryCheckbox(key) {
      return Object.keys(this.libraries).includes(key);
    },
  },
};
</script>
