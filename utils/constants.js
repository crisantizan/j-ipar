/** library keys */
export const libraryKeys = {
  CORE: { key: 'Prima Facie', backendKey: 'Core', staticValue: 'core' },
  CALIFORNIA: { key: 'California', backendKey: 'California', staticValue: 'california' },
  IMMIGRATION: { key: 'Immigration', backendKey: 'Immigration', staticValue: 'immigration' },
  SOCIAL_SECURITY: {
    /** key to display in UI */
    key: 'U.S Social Security Admin',
    /** key name in the user data */
    backendKey: 'SocialSecurityAdministration',
    /** string to identify the plan */
    staticValue: 'social security',
  },
  FEDERAL_COURT: {
    key: 'Federal Court and Bankruptcy',
    backendKey: 'Fedcourt',
    staticValue: 'federal court',
  },
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
