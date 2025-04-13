export const parseEnv = (name: string, value: string | undefined) => {
  if (!value) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid ENV value for: ${name}`);
};

export const getShowSubPackages = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_SUBPACKAGES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_SUBPACKAGES
  );
  return env === false ? false : true;
};
