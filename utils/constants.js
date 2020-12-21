/** library keys */
export const libraryKeys = {
  CORE: { key: 'Prima Facie', staticValue: 'core' },
  CALIFORNIA: { key: 'California', staticValue: 'california' },
  IMMIGRATION: { key: 'Immigration', staticValue: 'immigration' },
  SOCIAL_SECURITY: { key: 'Social Security', staticValue: 'social security' },
  FEDERAL_COURT: { key: 'Federal Court', staticValue: 'federal court' },
};

export const USER_ADDRESS_FIELDS = [
  {
    value: 'apt',
    field: 'addressAptCk',
  },

  {
    value: 'ste',
    field: 'addressSteCk',
  },

  {
    value: 'floor',
    field: 'addressFloorCk',
  },
];

/** user roles */
export const userRoles = {
  ADMIN: 'admin',
  USER: 'user',
};

/** regular expressions */
export const regex = {
  EMAIL: /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/,
};
