"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKeyPair = exports.sha256Hash = exports.comparePassword = exports.hashPassword = exports.apiToken = exports.validateUUID = exports.uuid = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const crypto_1 = require("crypto");
const elliptic_1 = require("elliptic");
/** @summary Private functions exported into public interface -------------- */
/**
 * @description creates a sha256 based has on a string input
 * @param {string} data the string value to be hashed
 * @returns {string} base64 hash string
 */
const _sha256Hash = (data) => {
    return (0, crypto_1.createHash)('sha256').update(data, 'binary').digest('base64');
    //                                               ------  binary: hash the byte string
};
/**
 * @description Creates a RFC4122 V4 compatible UUID
 * @returns {string} A UUID
 */
const _makeV4UUID = () => (0, uuid_1.v4)();
/**
 * @description Checks if the candidate string is a valid V4 UUID
 * @param {string} candidate The candidate string to validate
 * @returns {boolean} True if the candidate is a valid V4 UUID, false otherwise
 */
const _validateUUID = (candidate) => (0, uuid_1.validate)(candidate);
/**
 * @description Generates a Base64 encoded sequence of random characters to
 * the length specified (or 48 characters if omitted), using Nodes built-in
 * crypto module.
 * @param {number} length The size of the random string to create, if omitted
 * defaults to 48 characters.
 * @returns {string} a sequence of random string characters
 */
const _generateAPIKey = (length = 48) => (0, crypto_1.randomBytes)(length).toString('hex');
/**
 * @description Hashes a password for storage asynchronously, calling next with
 * an error parameter and a result parameter.
 * @param {string} password The plain text to encrypt
 * @param {number} saltRounds The number of rounds to use for the salt
 * @returns {Promise<string>} Passes control to the function specified in 'next'
 */
const _hashPassword = (password, saltRounds = 10) => __awaiter(void 0, void 0, void 0, function* () { return (0, bcrypt_1.hash)(password, saltRounds); });
/**
 * @description Asynchronously compares a password with one previously
 * encrypted passing the error (if any) and result when complete.
 * @param {string} password The password to compare
 * @param {string} encrypted The hashed value to compare against
 * @returns {Promise<boolean>}
 */
const _comparePassword = (password, encrypted) => (0, bcrypt_1.compare)(password, encrypted);
/**
 * @description generates a public/private keypair using elliptic
 * @returns {SignedKeyPair}
 */
const _generateKeyPair = () => {
    const ec = new elliptic_1.ec('secp256k1');
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
exports.uuid = _makeV4UUID;
exports.validateUUID = _validateUUID;
exports.apiToken = _generateAPIKey;
exports.hashPassword = _hashPassword;
exports.comparePassword = _comparePassword;
exports.sha256Hash = _sha256Hash;
exports.generateKeyPair = _generateKeyPair;
