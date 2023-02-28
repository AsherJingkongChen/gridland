export const serialize = (value: unknown) => {
  return JSON.stringify(value, undefined, 2);
};
