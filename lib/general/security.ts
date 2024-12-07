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

import { v4, validate } from 'uuid';
import { compare, hash } from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { ec as EC } from 'elliptic';
import { SignedKeyPair } from './security-types';

/** @summary Private functions exported into public interface -------------- */

/**
 * @description creates a sha256 based has on a string input
 * @param {string} data the string value to be hashed
 * @returns {string} base64 hash string
 */
const _sha256Hash = (data: string) => {
  return createHash('sha256').update(data, 'binary').digest('base64');
  //                                               ------  binary: hash the byte string
};

/**
 * @description Creates a RFC4122 V4 compatible UUID
 * @returns {string} A UUID
 */
const _makeV4UUID = () => v4();

/**
 * @description Checks if the candidate string is a valid V4 UUID
 * @param {string} candidate The candidate string to validate
 * @returns {boolean} True if the candidate is a valid V4 UUID, false otherwise
 */
const _validateUUID = (candidate: string) => validate(candidate);

/**
 * @description Generates a Base64 encoded sequence of random characters to
 * the length specified (or 48 characters if omitted), using Nodes built-in
 * crypto module.
 * @param {number} length The size of the random string to create, if omitted
 * defaults to 48 characters.
 * @returns {string} a sequence of random string characters
 */
const _generateAPIKey = (length = 48) => randomBytes(length).toString('hex');

/**
 * @description Hashes a password for storage asynchronously, calling next with
 * an error parameter and a result parameter.
 * @param {string} password The plain text to encrypt
 * @param {number} saltRounds The number of rounds to use for the salt
 * @returns {Promise<string>} Passes control to the function specified in 'next'
 */
const _hashPassword = async (password: string, saltRounds = 10) =>
  hash(password, saltRounds);

/**
 * @description Asynchronously compares a password with one previously
 * encrypted passing the error (if any) and result when complete.
 * @param {string} password The password to compare
 * @param {string} encrypted The hashed value to compare against
 * @returns {Promise<boolean>}
 */
const _comparePassword = (password: string, encrypted: string) =>
  compare(password, encrypted);

/**
 * @description generates a public/private keypair using elliptic
 * @returns {SignedKeyPair}
 */
const _generateKeyPair = (): SignedKeyPair => {
  const ec = new EC('secp256k1');
  const key = ec.genKeyPair();
  const publicKey = key.getPublic('hex');
  const privateKey = key.getPrivate('hex');
  return {
    publicKey,
    privateKey,
  };
};

/* -<>---------------------------------------------------------------------<>-
 * @summary Export declaration for Security Utils
 */

export const uuid = _makeV4UUID;
export const validateUUID = _validateUUID;
export const apiToken = _generateAPIKey;
export const hashPassword = _hashPassword;
export const comparePassword = _comparePassword;
export const sha256Hash = _sha256Hash;
export const generateKeyPair = _generateKeyPair;
