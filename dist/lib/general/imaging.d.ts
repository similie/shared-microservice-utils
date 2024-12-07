/**
 * @description General utility for encoding images and SVGs to Base64 encoded
 * image types. Primarily used in the PDF maker libraries.
 */
import { EncodeOptions } from "node-base64-image";
export declare const encodeImage: (url: string, options?: EncodeOptions) => Promise<unknown>;
export declare const ensureBase64EncodedImageHeader: (base64ImageString: string, fileName: string) => string;
export declare const stripBase64EncodedImageHeader: (base64ImageString: string) => string;
export declare const randomColor: () => string;
export declare const getFirstImage: (fileList: Array<any>, config?: {
    files: {
        download: string;
    };
}) => string | null;
