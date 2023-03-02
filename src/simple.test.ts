import { migrate } from "./simple";

describe("simple migration", () => {
  const migrations = [
    {
      version: undefined,
      migrate: (state: { [key: string]: unknown }) => {
        return {
          version: 1,
          ...state,
        };
      },
    },
    {
      version: 1,
      migrate: (state: { [key: string]: unknown }) => {
        return {
          version: 2,
          name: state.name,
          pets: [
            {
              type: "dog",
              name: state.dog,
            },
            {
              type: "cat",
              name: state.cat,
            },
          ],
        };
      },
    },
    {
      version: 2,
      migrate: (state: { [key: string]: unknown }) => {
        const tmp = (state.name as string).split(" ");
        return {
          version: 3,
          firstName: tmp[0].trim(),
          lastName: tmp.length > 1 ? tmp[1].trim() : "",
          pets: state.pets,
        };
      },
    },
  ];

  it("migrates the state to the latest version", () => {
    const state1 = {
      name: "Edgar Jones",
      dog: "Butcher",
      cat: "Sir Shitalot",
    };

    const migratedState = migrate(state1, migrations);

    expect(migratedState.version).toBe(3);
    expect(migratedState.firstName).toBe("Edgar");
    expect(migratedState.lastName).toBe("Jones");
    const pets = migratedState.pets as any[];
    expect(pets[0].type).toBe("dog");
    expect(pets[0].name).toBe("Butcher");
    expect(pets[1].type).toBe("cat");
    expect(pets[1].name).toBe("Sir Shitalot");
  });
});
