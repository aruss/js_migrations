// eslint-disable-next-line no-console
/* eslint-disable @typescript-eslint/no-explicit-any */

import { migrate, Schema } from "./migrations";

describe("migrate", () => {
  const migrations = [
    {
      from: 1,
      to: 2,
      up: (schema: Schema) => {
        return {
          version: 2,
          data: {
            name: schema.data.name,
            pets: [
              {
                type: "dog",
                name: schema.data.dog,
              },
              {
                type: "cat",
                name: schema.data.cat,
              },
            ],
          },
        };
      },
      down: (schema: Schema) => {
        return {
          version: 1,
          data: {
            name: schema.data.name,
            dog: schema.data.pets.find((c: any) => c.type === "dog"),
            cat: schema.data.pets.find((c: any) => c.type === "cat"),
          },
        };
      },
    },
    {
      from: 2,
      to: 3,
      up: (schema: Schema) => {
        const tmp: string = schema.data.name.split(" ");
        return {
          version: 3,
          data: {
            firstName: tmp[0].trim(),
            lastName: tmp.length > 1 ? tmp[1].trim() : "",
            pets: schema.data.pets,
          },
        };
      },
      down: (schema: Schema) => {
        return {
          version: 2,
          data: {
            name: `${schema.data.firstName} ${schema.data.lastName}`.trim(),
            pets: schema.data.pets,
          },
        };
      },
    },
  ];

  it("migrates the state to the latest version when no toVersion is provided", () => {
    const state1 = {
      version: 1,
      data: {
        name: "Edgar Jones",
        dog: "Daffodil",
        cat: "Miky",
      },
    };

    const migratedState = migrate(state1, migrations);

    expect(migratedState.version).toBe(3);
    expect(migratedState.data.firstName).toBe("Edgar");
    expect(migratedState.data.lastName).toBe("Jones");
    expect(migratedState.data.pets[0].type).toBe("dog");
    expect(migratedState.data.pets[0].name).toBe("Daffodil");
    expect(migratedState.data.pets[1].type).toBe("cat");
    expect(migratedState.data.pets[1].name).toBe("Miky");
  });

  it("migrates the state to the specified version when toVersion is provided", () => {
    const state1 = {
      version: 1,
      data: {
        name: "Edgar Jones",
        dog: "Daffodil",
        cat: "Miky",
      },
    };

    const migratedState = migrate(state1, migrations, 2);

    expect(migratedState.version).toBe(2);
    expect(migratedState.data.name).toBe("Edgar Jones");
    expect(migratedState.data.pets[0].type).toBe("dog");
    expect(migratedState.data.pets[0].name).toBe("Daffodil");
    expect(migratedState.data.pets[1].type).toBe("cat");
    expect(migratedState.data.pets[1].name).toBe("Miky");
  });

  it("migrates the state to the previous version when toVersion is provided", () => {
    const state3 = {
      version: 3,
      data: {
        firstName: "Edgar",
        lastName: "Jones",
        pets: [
          {
            type: "dog",
            name: "Daffodil",
          },
          {
            type: "cat",
            name: "Miky",
          },
        ],
      },
    };

    const migratedState = migrate(state3, migrations, 2);

    expect(migratedState.version).toBe(2);
    expect(migratedState.data.name).toBe("Edgar Jones");
    expect(migratedState.data.pets[0].type).toBe("dog");
    expect(migratedState.data.pets[0].name).toBe("Daffodil");
    expect(migratedState.data.pets[1].type).toBe("cat");
    expect(migratedState.data.pets[1].name).toBe("Miky");
  });

  it("throws an exception when no migration is found", () => {
    const state1 = {
      version: 1,
      data: {
        name: "Edgar Jones",
        dog: "Daffodil",
        cat: "Miky",
      },
    };

    const noMigrationFn = () => {
      migrate(state1, migrations, 4);
    };

    expect(noMigrationFn).toThrowError(
      "No migration found from version 3 to version 4."
    );
  });
});
