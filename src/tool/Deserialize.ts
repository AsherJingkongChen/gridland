export const deserialize =
  (value: any) => {
    return JSON.stringify(value, undefined, 2);
  };
