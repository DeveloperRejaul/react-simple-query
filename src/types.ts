/**
 * @fileoverview Type definitions for React Simple Query library
 * 
 * This module contains all TypeScript interfaces and types used throughout the library
 * for type safety and better developer experience with autocomplete and type checking.
 */

/**
 * Configuration object passed to QueryProvider
 * Defines global settings for HTTP requests, caching, and response/error handling
 */
export interface ConfigType{
    /** Enable client-side caching of GET requests */
    cash?:boolean,
    /** Global request timeout in milliseconds. Default: 30000ms (30 seconds) */
    requestTimeout?:number
    /** Global cache expiration timeout in milliseconds. Default: 30000ms (30 seconds) */
    cashTimeout?:number
    /** Base URL prepended to all relative URLs in requests */
    baseUrl:string
    /** Global error handler called when any request fails */
    onError?:(error:any)=>void | Promise<void>
    /** Global success handler called when any request succeeds */
    onSuccess?:(data:any)=>void | Promise<void>
    /** Global transformer to modify response data before returning */
    transformResponse?:(data:any)=> void | Promise<void>
    /** Global transformer to modify error objects before returning */
    transformError?:(error:any)=> void | Promise<void>
    /** Global transformer to modify request headers before sending */
    transformHeader?:(data:Headers)=>Headers | Promise<Headers>
}

/**
 * Context object provided by QueryProvider to useQuery and useMutation hooks
 * Contains configuration and reference to the cache map
 */
export interface ContextType {
    /** Global configuration merged with defaults */
    config: ConfigType,
    /** Reference to the in-memory cache storage (Map) */
    cashRef: React.RefObject<Map<string, any>>
}

/**
 * Props object for the QueryProvider component
 */
export type PropsType = {
  /** React child components that will have access to the query context */
  children: React.ReactNode;
  /** Configuration object for the query provider */
  config: ConfigType;
}

/**
 * Helper object for manual cache management
 * Provides utility methods to interact with the cache directly
 */
export interface IHelper {
    /** Add a new item to the cache with a specific ID */
    addCash: (id: string, data: any) => void;
    /** Clear all cached items */
    clearCash: () => void;
    /** Retrieve the entire cache Map object */
    getCash: () => Map<string, any>;
    /** Get a specific cached item by URL */
    getCashByUrl: (url: string) => void;
    /** Update an existing cached item by URL */
    updateCashByUrl: (url: string, data: any) => void;
    /** The base URL used for requests */
    baseUrl: string;
}

/**
 * State shape for the hook state
 * Represents the current state of a query or mutation request
 * @template T The data type returned by the request
 */
export interface State<T, E,C>{
    /** True when initial request is being made */
    isLoading: boolean;
    /** True when request is being made (includes subsequent requests) */
    isFetching: boolean;
    /** True when request completed successfully */
    isSuccess: boolean;
    /** True when request failed with an error */
    isError: boolean;
    /** Error object if request failed, null otherwise */
    error: E | null;
    /** Response data if request succeeded, null otherwise */
    data: T | null;
    currentData: C | null;
}

/**
 * Parameters object for useQuery and useMutation hooks
 * Allows overriding request behavior on a per-request basis
 * @template T The expected data type returned by the request
 */
export interface ReqParamsTypes<R,P,E=any, C=any>{
    /** HTTP method: GET, POST, PUT, or DELETE. Default: GET */
    method?:"GET" | "POST" | "PUT" | "DELETE";
    /** Request body payload (typically for POST/PUT requests) */
    body?:P,
    /** Custom Headers object for the request */
    headers?:Headers,
    /** Override global cache setting for this specific request */
    useCash?:boolean;
    /** Override global cache timeout for this specific request (in milliseconds) */
    cashTimeout?:number;
    /** Override global request timeout for this specific request (in milliseconds) */
    requestTimeout?:number
    /** Custom cache key to use instead of the URL */
    cashId?:string;
    /** Error handler specific to this request (called in addition to global handler) */
    onError?:(error:E)=>void | Promise<void>
    /** Success handler specific to this request (called in addition to global handler) */
    onSuccess?:(data:R)=>void | Promise<void>
    /** Transform response data for this request only */
    transformResponse?:(data:C)=> R | Promise<R>
    /** Transform error for this request only */
    transformError?:(error:E)=> E | Promise<E>
    /** Transform headers for this request only */
    transformHeader?:(data:Headers)=>Headers | Promise<Headers>
     /** Transform body for this request only */
    transformBody?:<T=any>(data:P)=>T | Promise<T> 
    updateQueryData?:(prevusData:R ,curentData:R)=>R | Promise<R> 
}