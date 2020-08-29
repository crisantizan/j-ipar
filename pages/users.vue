<template>
  <div>
    <h1>Users</h1>
    <div class="card-box mt-2">
      <!-- <datatable :headers="headers" :columns="users" /> -->
      <client-only>
        <!-- custom header -->
        <div class="d-flex mb-2">
          <div class="search btn-group mr-2">
            <input
              class="form-control search-input"
              type="text"
              placeholder="Search"
              autocomplete="off"
              v-model="searchTerm"
            />
            <div class="btn btn-primary" style="cursor: default;">
              <i class="fa fa-search" aria-hidden="true"></i>
            </div>
          </div>

          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fa fa-th-list" aria-hidden="true"></i>
            </button>

            <div class="dropdown-menu p-0" aria-labelledby="dropdownMenuButton">
              <form @submit.prevent>
                <div
                  v-for="column of columns"
                  :key="column.field"
                  class="dropdown-item px-0"
                >
                  <div
                    v-if="column.toggle"
                    class="custom-control custom-checkbox mx-1"
                  >
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      :id="`toggle${column.field}`"
                      :checked="!column.hidden"
                      @change="e => (column.hidden = !column.hidden)"
                    />
                    <!-- v-model="column.hidden" -->
                    <label
                      class="custom-control-label d-flex align-items-center"
                      :for="`toggle${column.field}`"
                    >
                      {{ column.label }}
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- end custom header -->

        <vue-good-table
          styleClass="vgt-table striped"
          :columns="columns"
          :rows="users"
          compactMode
          :pagination-options="{
            enabled: true,
            mode: 'pages',
            perPage: 5,
            perPageDropdown: [5, 10, 15, 20],
          }"
          :search-options="{
            enabled: true,
            externalQuery: searchTerm,
          }"
        >
          <template slot="table-row" slot-scope="props">
            <template
              v-if="
                props.column.field == 'assignLibraries' && !props.column.hidden
              "
            >
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
            <span v-else>
              {{ props.formattedRow[props.column.field] }}
            </span>
          </template>
        </vue-good-table>
      </client-only>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { generateCheckboxHTML } from '../helpers/generate-html';

export default {
  components: {
    datatable: () => import('~/components/Datatable'),
  },
  data() {
    const self = this;

    return {
      searchTerm: '',
      availableLibraries: ['Immigration', 'California'],
      columns: [
        { field: 'id', hidden: true },
        { field: 'firstName', label: 'Name', hidden: false, toggle: true },
        { field: 'email', label: 'Email', hidden: false, toggle: true },
        {
          field: 'admin',
          label: 'Role',
          hidden: false,
          toggle: true,
          formatFn: isAdmin => {
            return isAdmin ? 'Admin' : 'User';
          },
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
  },
};
</script>
