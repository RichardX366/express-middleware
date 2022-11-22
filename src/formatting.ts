export const formatPhoneNumber = (
  phoneNumberString?: string | null,
): string => {
  if (!phoneNumberString) return '';
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumberString;
};

export const formatNumber = (num?: number | null): string => {
  return num ? num.toLocaleString('en-US') : '0';
};

export const capitalize = (str: string): string =>
  str[0]?.toUpperCase() + str.slice(1).toLowerCase();

export const unCamelCase = (str: string): string =>
  str.replace(/([A-Z]|\d)/g, ' $1').replace(/^./, function (str) {
    return str.toUpperCase();
  });

export const unScreamingSnakeCase = (str: string): string =>
  str.split('_').map(capitalize).join(' ');

/**
 * Removes duplicate objects/primitives
 * @param list The list of objects/primitives
 * @param key The key that you want remove duplicates by (eg. 'id') (if there is none provided, it requires the list be of primitives eg. strings)
 * @returns A list without duplicate objects/primitives
 */
export const removeListDuplicates = <S>(list: S[], key?: keyof S): S[] =>
  list.reduce(
    (prev, curr) =>
      (key ? prev.find((item) => item[key] === curr[key]) : prev.includes(curr))
        ? prev
        : prev.concat(curr),
    [] as S[],
  );

export const lean = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

/**
 * Replaces all falsey values in an object with '' (for handling forms)
 * @param value The object to replace falsey values with ''
 * @returns The object with all falsey values as ''
 */
export const falseyToEmpty = (obj: any) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      value ? [key, value as string] : [key, ''],
    ),
  );

export const formatFileSize = (bytes: number) => {
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
    bytes /= 1000;
    i++;
  } while (bytes > 1000);

  return Math.max(bytes, 0.1).toFixed(1) + byteUnits[i];
};

export const hydrateBrackets = (
  string: string,
  data: { [key: string]: string },
) => {
  for (const key in data) {
    string = string.replaceAll(`{${key}}`, data[key]);
  }
  return string;
};

export const wordDate = (date: Date | string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const numberDate = (date: Date | string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const numberToWeekday = (n: number) =>
  new Date((4 + n) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: 'UTC',
  });

export const isDST = (date: string | Date) => {
  date = new Date(date);
  let jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  let jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== date.getTimezoneOffset();
};

export const UTCTimeToEST = (time: string, date?: Date | string) => {
  let hour =
    (+time.split(':')[0] - (isDST(date || new Date()) ? 4 : 5) + 24) % 24;
  if (hour < 0) hour += 24;
  let amPM = hour < 12 ? 'AM' : 'PM';
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${hour}:${time.split(':')[1]} ${amPM}`;
};

export const requireValidCurrencyFormat = (value: number) => {
  if (Math.round(value * 100) / 100 !== value) {
    throw new Error(
      'Your currency can have at least two decimal places of precision (cents).',
    );
  }
  if (value <= 0) {
    throw new Error('You must specify a positive amount.');
  }
};

export const removeUndefinedValues = (value: { [key: string]: any }): any =>
  Object.fromEntries(
    Object.entries(value)
      .map(([key, value]) => [
        key,
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length
          ? removeUndefinedValues(value)
          : value,
      ])
      .filter(([_, value]) => value !== undefined),
  );

/**
 * Gets a nested property from an object and string of keys
 * @param obj The object to recuse properties through
 * @param properties The properties to recurse through (array of keys or single key for non-nested properties)
 * @param error Error to throw if property is not found
 * @returns The value of the nested property or undefined if any key not found
 */
export function getNestedProperty<T = any>(
  obj: any,
  properties: string | string[],
  error: true,
): T;
export function getNestedProperty<T = any>(
  obj: any,
  properties: string | string[],
  error?: false,
): T | undefined;
export function getNestedProperty<T = any>(
  obj: any,
  properties: string | string[],
  error: boolean | undefined,
): T | undefined {
  let result = obj;
  if (typeof properties === 'string') properties = [properties];
  if (typeof result !== 'object') {
    if (error) throw new Error(`Property not found`);
    else return undefined;
  }
  for (let i = 0; i < properties.length; i++) {
    const key = properties[i];
    result = result[key];
    if (typeof result !== 'object') {
      if (error) throw new Error(`Property not found`);
      else return undefined;
    }
  }
  return result;
}
