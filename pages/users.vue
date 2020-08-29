<template>
  <div>
    <h1>Users</h1>
    <div class="card-box mt-2">
      <!-- <datatable :headers="headers" :columns="users" /> -->
      <vue-datatable :columns="columns" :rows="users">
        <template slot="table-row" slot-scope="props">
          <!-- generate checkboxes in "assignLibraries" field -->
          <template
            v-if="printCheckboxes(props.column.field, props.column.hidden)"
          >
            <!-- print only avaibales libraries -->
            <div
              v-for="library in availableLibraries"
              :key="library"
              class="custom-control custom-checkbox d-flex"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                :id="generateCheckboxId(library, props.formattedRow.id)"
                :value="library"
                :checked="
                  isChecked(props.formattedRow.assignLibraries, library)
                "
              />
              <label
                class="custom-control-label d-flex align-items-center"
                :for="generateCheckboxId(library, props.formattedRow.id)"
              >
                {{ library }}
              </label>
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
import { mapGetters } from 'vuex';
import { generateCheckboxHTML } from '../helpers/generate-html';

export default {
  components: {
    // datatable: () => import('~/components/Datatable'),
    VueDatatable: () => import('@/components/vue-datatable/Table'),
  },
  data() {
    const self = this;

    return {
      searchTerm: '',
      availableLibraries: ['Immigration', 'California'],
      columns: [
        {
          field: 'id',
          hidden: true,
        },
        {
          field: 'firstName',
          label: 'Name',
          hidden: false,
          toggle: true,
          formatFn: value => {
            return value;
          },
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
      /** datatable headers */
      headers: [
        {
          title: 'Name',
          field: 'firstName',
          sortable: true,
          formatter: (current, { lastName }) => {
            return `${current} ${lastName}`;
          },
        },
        {
          title: 'Email',
          field: 'email',
          sortable: true,
        },
        {
          title: 'Role',
          field: 'admin',
          sortable: true,
          formatter: current => {
            return current ? 'Admin' : 'User';
          },
        },
        {
          title: 'Libraries',
          field: 'assignLibraries',
          sortable: true,
          class: 'libraries-checkboxes',
          formatter: (current, { id }) => {
            // print checkboxes
            return ['Immigration', 'California']
              .map(value => {
                return generateCheckboxHTML(
                  `${value}${id}`,
                  value,
                  current[value],
                );
              })
              .join('');
          },
          events: {
            // listen input change event
            'change .custom-control-input': ({ target }, _, row) => {
              self.onCheckedLibrary({
                id: row.id,
                checked: target.checked,
                library: target.value,
              });
            },
          },
        },
        { field: 'lastName', visible: false },
        { field: 'id', visible: false },
      ],
    };
  },
  computed: {
    ...mapGetters('users', ['users']),
  },
  methods: {
    generateCheckboxId(library, id) {
      return `checkLib${library}${id}`;
    },
    /** on checked event */
    onCheckedLibrary({ id, checked, library }) {
      // const nodes = document.querySelectorAll('td.libraries-checkboxes');
      console.log({ id, checked, library });
    },
    isChecked(assignLibraries, library) {
      return assignLibraries[library];
    },
    /** verify if the field is "assignLibraries" and is not hidden */
    printCheckboxes(field, hidden) {
      return field === 'assignLibraries' && !hidden;
    },
  },
};
</script>
