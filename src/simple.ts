export const migrate = (
  state: {
    [key: string]: unknown;
  },
  migrations: {
    version: number | string | undefined;
    migrate: (state: { [key: string]: unknown }) => {
      [key: string]: unknown;
    };
  }[],
  versionKey: string = "version"
): {
  [key: string]: unknown;
} => {
  const fromVersion = state[versionKey] as number | string | undefined;

  const currentMigration = migrations.find(
    (migration) => migration.version === fromVersion
  );

  if (currentMigration) {
    const newSchema = currentMigration.migrate(state);
    return migrate(newSchema, migrations);
  }

  return state;
};
