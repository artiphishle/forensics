/**
 * Parse ENV variable
 * @todo Support more than boolean as soon as needed
 */
export const parseEnv = (name: string, value: string | undefined) => {
  if (!value) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid ENV value for: ${name}`);
};

/**
 * Whether to show sub packages
 * @default true
 */
export const getShowSubPackages = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_SUBPACKAGES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_SUBPACKAGES
  );
  return env === false ? false : true;
};

/**
 * Whether to show vendor packages
 * @default false
 */
export const getShowVendorPackages = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES
  );

  return env === true ? true : false;
};
