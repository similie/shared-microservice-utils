/**
 * @description replacement for the giant /services/Utils.js.
 * Contains those functions but they have been relayered as
 * necessary to provide a clearer intent in the codebase.
 */
import { IsThis } from "./is-this";
import * as Imaging from "./imaging";
import * as Security from "./security";
import { RequiredParamsErrorCode, ICurrency } from "../constants";
/** @summary Export declarations */
export declare const constants: {
    nodeModuleVersionNumbers: {
        v8: number;
        v9: number;
        v10: number;
        v11: number;
        v12: number;
        v13: number;
        v14: number;
        v15: number;
        v16: number;
        v17: number;
        v18: number;
        v20: number;
    };
    ENUMS: {
        /** List of error codes that can be passed for GetErrorCode to build
         * a throwable error
         */
        ErrorCodes: typeof RequiredParamsErrorCode;
    };
};
export declare const nodeModuleVersion: () => number;
export declare const coerceToArray: (candidate: Array<any> | any) => any;
export declare const getModelId: (candidate: object | any) => any;
export declare const parseLocals: (stringValue: string, locals: Record<string, unknown>, nullify?: boolean) => string;
export declare const getErrorForCode: (code: RequiredParamsErrorCode) => {
    code: number;
    message: string;
};
export declare const guardItsRequired: (errorCode: RequiredParamsErrorCode, ...required: any) => boolean;
export declare const truncateText: (value: string, toLength: number) => string;
export declare const transformAttributes: (attrs: Record<string, any>) => Record<string, any>;
export declare const populateNotNullRecords: (records: Array<Record<string, any>>, ...keys: string[]) => Record<string, any>[];
export declare const stripUndefinedIds: (candidates: null | undefined | Array<any>) => number[];
export declare const deepKeys: (obj: any, cb: any) => any;
export declare const deepValues: (obj: any, ...keys: string[]) => any[];
export declare const hasKeysShallow: (obj: any, ...keys: string[]) => boolean;
export declare const containsValue: (obj: object, contains: any, ...key: string[]) => boolean;
export declare const fixDecimalPlaces: (candidate: string | number, round?: boolean, length?: number) => string | number;
export declare const asMoney: (amount: number | string, currency?: string | ICurrency, localeCode?: string) => string;
export declare const pullHost: (config: any) => string;
export declare const responseMask: (cb: (message: string, value: any) => void) => {
    send: (values: any) => void;
    ok: (values: any) => void;
    serverError: (values: any) => void;
    badRequest: (values: any) => void;
};
export declare const isThis: typeof IsThis;
export declare const imaging: typeof Imaging;
export declare const security: typeof Security;
