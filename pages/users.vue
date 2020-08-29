<template>
  <div>
    <h1>Users</h1>
    <div class="card-box mt-2">
      <datatable :headers="headers" :columns="users" />
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
    /** on checked event */
    onCheckedLibrary({ id, checked, library }) {
      // const nodes = document.querySelectorAll('td.libraries-checkboxes');
      console.log({ id, checked, library });
    },
  },
};
</script>
