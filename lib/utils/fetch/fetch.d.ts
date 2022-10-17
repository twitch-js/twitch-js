import { IStringifyOptions } from 'qs';
import { TwitchJSError } from '../error';
declare type QueryParams = {
    /** Any query parameters you want to add to your request. */
    [key: string]: string | number | boolean;
};
interface BodyParams {
    [key: string]: any;
}
export declare type FetchOptions<Query = QueryParams, Body = BodyParams> = Omit<RequestInit, 'body'> & {
    search?: Query;
} & {
    body?: Body;
};
export declare class FetchError extends TwitchJSError {
    body?: any;
    constructor(message: string, body?: any);
}
/**
 * Fetches URL
 */
declare const fetchUtil: <Response_1 = any, Query = QueryParams, Body_1 = BodyParams>(url: RequestInfo, options?: FetchOptions<Query, Body_1> | undefined, qsOptions?: IStringifyOptions | undefined) => Promise<Response_1>;
export default fetchUtil;
