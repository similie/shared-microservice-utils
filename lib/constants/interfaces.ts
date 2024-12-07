/** Model definition for a single currency. key is the 3-Digit ISO code */
export interface ICurrency {
  symbol: string;
  key: string;
  name?: string;
  locale_code?: string;
}

/**
 * @summary Model definition for a query object passed into the
 * ParameterUtils.forceRequestParameters function
 * @todo Find and specify type[s] for the 'value' field
 * @example { type: 'integer', key: 'site_role', value: params.role }
 */
export interface IModelAttributeParameterQuery<T> {
  /** @todo possibly key of: 'string', 'integer', model, collection etc */
  type: string;
  key: string;
  value: T;
}

/**
 * @summary Model definition for an array of IForcedParameterQuery objects
 * passed into the ParameterUtils.forceRequestParams function
 */
export interface IModelAttributeParameterQueryList<T>
  extends Array<IModelAttributeParameterQuery<T>> {}

/**
 * @summary Model definition for the object passed into the
 * ParameterUtils.forceRequestParams function
 * @example
 * {
 *    model: 'user',
 *    query: [{ type: 'integer', key: 'site_role', value: params.role }]
 * }
 */
export interface IModelAttributeParameter<T> {
  model: string;
  query: IModelAttributeParameterQueryList<T>;
}

/**
 * @description Description of the types of date-like values that can be used
 * for date-like operations in DateTimeParser and constructors/functions that
 * use the parser for reading input parameter values.
 */
export type DateTimeValue = string | number | Date | object;

/** @description An object representation of a time value */
export type TimeObject = {
  hours: number;
  minutes: number;
  seconds: number;
};

/** @description An object representation of a date-time value */
export type DateTimeObject = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

/** @description A plural/singular object definition for attaching to
 * larger structures which need a definition for both cases.
 */
export type PluralLabel = { singular: string; plural: string };

/** @description An object representing the labels that can be used to describe
 * the parts of a date-time object when rendering into a multi-language UI.
 */
export type DateTimeObjectLabels = Record<keyof DateTimeObject, PluralLabel>;
