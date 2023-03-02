/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Schema {
  version: number;
  data: any;
}

export function migrate(
  schema: Schema,
  migrations: {
    from: number;
    to: number;
    up: (schema: Schema) => Schema;
    down: (schema: Schema) => Schema;
  }[],
  toVersion?: number
): Schema {
  const fromVersion = schema.version;

  if (!toVersion) {
    toVersion = Math.max(...migrations.map((migration) => migration.to));
  }

  const direction = upOrDown(fromVersion, toVersion);

  if (direction === 0) {
    return schema;
  }

  const currentMigration = migrations.find(
    (migration) => migration[direction === 1 ? "from" : "to"] === fromVersion
  );

  if (currentMigration) {
    const newSchema = currentMigration[direction === 1 ? "up" : "down"](schema);
    return migrate(newSchema, migrations, toVersion);
  }

  throw new Error(
    `No migration found from version ${fromVersion} to version ${toVersion}.`
  );
}

function upOrDown(fromVersion: number, toVersion: number): -1 | 0 | 1 {
  if (fromVersion < toVersion) {
    return 1;
  } else if (fromVersion > toVersion) {
    return -1;
  }
  return 0;
}
