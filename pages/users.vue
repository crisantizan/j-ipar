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
export default {
  components: {
    datatable: () => import('~/components/Datatable'),
  },
  data: () => ({
    availableLibraries: ['Immigration', 'California'],
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
        formatter: current => {
          return 'Checkboxes here!';
        },
      },
      { field: 'lastName', visible: false },
    ],
  }),
  computed: {
    ...mapGetters('users', ['users']),
  },
};
</script>
