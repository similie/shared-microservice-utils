/**
 * @description A collection of functions for generating, hashing and comparing
 * unique keys, api tokens.
 *
 * @requires
 *  - Built-in crytpo package from NodeJS,
 *  - UUID
 *  - Bcrypt
 *  - Elliptic
 */
import { SignedKeyPair } from './security-types';
export declare const uuid: () => string;
export declare const validateUUID: (candidate: string) => boolean;
export declare const apiToken: (length?: number) => string;
export declare const hashPassword: (password: string, saltRounds?: number) => Promise<string>;
export declare const comparePassword: (password: string, encrypted: string) => Promise<boolean>;
export declare const sha256Hash: (data: string) => string;
export declare const generateKeyPair: () => SignedKeyPair;
