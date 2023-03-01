const migrate = require("./migrations");

const migrationsForA = [
  {
    from: "1",
    to: "2",
    up: (schema) => {
      const newSchema = {
        version: "2",
        person: {
          name: schema.person.name,
        },
        pets: {
          ...schema.person.pets,
        },
      };
      return newSchema;
    },
    down: (schema) => {
      const newSchema = {
        version: "1",
        person: {
          ...schema.person,
          pets: { ...schema.pets },
        },
      };
      return newSchema;
    },
  },
];

const stateAOld = {
  version: "1",
  person: {
    name: "Edgar",
    pets: {
      type: "dog",
      name: "Daffodil",
    },
  },
};

test("migrate thing a", () => {
  const migrated = migrate(stateAOld, "2", migrationsForA);

  console.log(migrated);
});
