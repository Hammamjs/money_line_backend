type PostgresError = {
  code: string;
  constraint?: string;
};

export const isPostgresError = (err: unknown): err is PostgresError =>
  typeof err === 'object' &&
  err !== null &&
  'code' in err &&
  typeof err.code === 'string';
