/**
 * @description Get the keys of an object
 */
export type ObjectKeys<T> = keyof T;

/**
 * @description Get the values of an object
 */
export type ObjectValues<T> = T[ObjectKeys<T>];
