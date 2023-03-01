function migrate(schema, toVersion, migrations) {
  const fromVersion = schema.version;
  const direction = upOrDown(fromVersion, toVersion);
  if (direction === "same") {
    return schema;
  }
  const currentMigration = migrations.find(
    (migration) => migration[direction === "up" ? "from" : "to"] === fromVersion
  );
  const newSchema = currentMigration[direction](schema);
  return migrate(newSchema, toVersion);
}

function upOrDown(fromVersion, toVersion) {
  const fromNumbers = fromVersion.split(".").map((el) => Number(el));
  const toNumbers = toVersion.split(".").map((el) => Number(el));
  for (let i = 0; i < fromNumbers.length; i++) {
    if (fromNumbers[i] < toNumbers[i]) {
      return "up";
    }
    if (fromNumbers[i] > toNumbers[i]) {
      return "down";
    }
  }
  return "same";
}

module.exports = migrate;
