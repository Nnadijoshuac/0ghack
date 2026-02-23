export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  pseudonym: string;
  email: string;
  passwordHash: string;
  createdAtISO: string;
};

export type AuthDb = {
  users: AuthUser[];
  updatedAtISO: string;
  last0gRootHash?: string;
};
