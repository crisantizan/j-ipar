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
    var self = this;
    return {
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
          formatter: (current, { id }) => {
            return ['Immigration', 'California']
              .map(value => {
                return generateCheckboxHTML(`${value}${id}`, value);
              })
              .join(' ');
          },
          events: {
            'change .custom-control-input': ({ target }, value, row) => {
              self.clickRow({ checked: target.checked, value, row });
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
    clickRow({ checked, value, row }) {
      console.log({ checked, value, row });
    },
  },
};
</script>
