"use strict";
/**
 * @description General utility for encoding images and SVGs to Base64 encoded
 * image types. Primarily used in the PDF maker libraries.
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
exports.getFirstImage = exports.randomColor = exports.stripBase64EncodedImageHeader = exports.ensureBase64EncodedImageHeader = exports.encodeImage = void 0;
const node_base64_image_1 = require("node-base64-image");
const lodash_1 = require("lodash");
// import got from "got";
// import {ISysFileModelEntity} from '@similie/types';
/**
 * @summary Base64 encoded images for display in a web environment use these
 * prefixes for display in img tags. E.g. data:image/jpg;base64,
 */
const _imageHeader = {
    prefix: "data:image/",
    postfix: ";base64,",
};
const _svgString2Image = (url, width, height, format = "png") => __awaiter(void 0, void 0, void 0, function* () {
    let sharpStream;
    try {
        const urlObj = new URL(url);
        sharpStream = require("sharp")({ failOn: "none" });
        require("got").stream(urlObj).pipe(sharpStream);
    }
    catch (_a) {
        sharpStream = require("sharp")(url);
    }
    if (format.includes("jpeg")) {
        sharpStream.jpeg({ mozjpeg: true, quality: 100 });
    }
    if (width && height) {
        sharpStream.resize(width, height);
    }
    const outputBuffer = yield sharpStream.toBuffer();
    const base64 = outputBuffer.toString("base64");
    return _ensureBase64ImgHeader(base64, `*.${format}`);
});
/**

/**
 * @description Checks the last part of a string after a dot character to
 * establish the .xxx file type. E.g. .jpg, .jpeg, .png etc.
 * @param {string} url
 * @returns {string} The portion of the string after the last dot character
 */
const _fileType = (url) => {
    const split = url.split(".");
    return split[split.length - 1];
};
/**
 * @description Uses the fileType function to determine if the specified url
 * ends with 'svg'
 * @param {string} url The file name/path to check
 * @returns {string}
 */
const _containsSVG = (url) => {
    return _fileType(url) === "svg";
};
/**
 * @description Base64 encodes an image at the specified path
 * @param {string} url The file url/path of the image to encode
 * @param {EncodeOptions} options Encoding options.
 * @returns {Promise<string>}
 *   Promise containing a string with the encoded image on completion
 */
const _encodeImage = (url, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    if (_containsSVG(url)) {
        return _svgString2Image(url, 200, 200, "jpeg");
    }
    let opts = options || {};
    if (!(0, lodash_1.includes)(url, "http"))
        opts["local"] = true;
    if (!opts["string"])
        opts["string"] = true;
    const result = new Promise((resolve, reject) => {
        (0, node_base64_image_1.encode)(url, opts).then((value) => {
            resolve(_ensureBase64ImgHeader(value.toString("base64"), url));
        }, (err) => {
            reject(err);
        });
    });
    return result;
});
/**
 * @description Wrapper function to ensure that a Base64 encoded image is
 * correctly wrapped with a 'data:image/<type>;base64' header.
 * @param {string} base64ImageString A base64 encoded image
 * @param {string} fileName The default file type to apply if the image string
 * doesn't already contain a type
 * @returns {string} A correctly wrapped base64 encoded image
 */
const _ensureBase64ImgHeader = (base64ImageString, fileName) => {
    const prefix = _imageHeader.prefix;
    const postfix = _imageHeader.postfix;
    if (base64ImageString.startsWith(prefix)) {
        return base64ImageString;
    }
    let imgType = _fileType(fileName) || "jpeg";
    if (imgType === "svg")
        imgType += "+xml";
    return `${prefix}${imgType}${postfix}${base64ImageString}`;
};
/**
 * @description Inspects and strips if required, the base64 encoded header
 * from an encoded image string.
 * @param {string} base64ImageString The candidate string to inspect
 * @returns {string}
 *   A copy of the input with any base64 image encoded header stripped
 */
const _stripBase64ImgHeader = (base64ImageString) => {
    const prefix = _imageHeader.prefix;
    let result = base64ImageString;
    if (result.startsWith(prefix)) {
        const i = result.indexOf(",");
        if (i > 0)
            result = result.substring(i + 1);
    }
    return result.toString();
};
/**
 * @description Accepts zero or more SysFile models and a site data config and
 * returns a download path for the first image type file found in the input
 * array. If no files were supplied or no image files were found, returns null.
 * If no [valid] config was specified, returns the ID of the first image found
 * or null if none were found.
 * @param {ISysfileEntity[]} fileList Zero or more SysFile objects
 * @param {{files: {download: string}}} config Optional local site data object.
 * Should contain a key-path of .files.download.
 * @returns {string}
 *   - A download path for the first image type model in the list
 *   - null of the list was empty or didn't contain a file with an image type
 *   - the model ID if no (or a malformed) config was supplied
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getFirstImage = (fileList, config) => {
    var _a, _b;
    if (!(0, lodash_1.size)(fileList))
        return null;
    let result = "";
    let url = "";
    if (config) {
        url = `${(_a = config["files"]) === null || _a === void 0 ? void 0 : _a.download}/`;
    }
    const len = (0, lodash_1.size)(fileList);
    for (let i = 0; i < len; i++) {
        const file = fileList[i];
        if (file && ((_b = file.type) === null || _b === void 0 ? void 0 : _b.startsWith("image/"))) {
            result = `${url}${file.id}`;
            break;
        }
    }
    return result;
};
/**
 * @description Generate a random HEX encoded HTML color string
 * @returns {string} HTML color string
 * @example const c = randomColor()
 * c = #ABCDEF
 */
const _color = () => {
    return "#" + Math.random().toString(16).slice(2, 8);
};
//* * @summary Export declarations */
exports.encodeImage = _encodeImage;
exports.ensureBase64EncodedImageHeader = _ensureBase64ImgHeader;
exports.stripBase64EncodedImageHeader = _stripBase64ImgHeader;
exports.randomColor = _color;
exports.getFirstImage = _getFirstImage;
