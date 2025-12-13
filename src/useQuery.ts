/**
 * @fileoverview useQuery Hook - Data fetching and caching hook for GET requests
 * 
 * This module exports the useQuery hook which handles fetching data from APIs with
 * automatic caching, timeout management, and error/success callbacks.
 * 
 * @module useQuery
 */

'use client';

import { useProvider } from 'provider';
import {useEffect, useLayoutEffect, useState} from 'react'
import { PublicUseQueryReturn, ReqParamsTypes, State } from 'types';

/**
 * useQuery Hook - Fetch and cache data from API endpoints
 * 
 * Provides reactive data fetching with built-in caching, timeout handling, and request lifecycle management.
 * Automatically fetches data when the URL is provided, and manages loading/error states.
 * 
 * @template T The type of data returned by the API endpoint
 * @param {string} [url] The endpoint URL to fetch from. Can be relative (uses baseUrl) or absolute.
 * @param {ReqParamsTypes<T>} [params] Optional configuration and parameters for the request
 * 
 * @returns {Object} Object containing request state and methods
 * @returns {boolean} .isLoading True during initial request
 * @returns {boolean} .isFetching True during any request (initial or subsequent)
 * @returns {boolean} .isSuccess True when request completed successfully
 * @returns {boolean} .isError True when request failed
 * @returns {any} .error Error object if request failed, null otherwise
 * @returns {T|null} .data Response data if successful, null otherwise
 * @returns {Function} .req Manual request function: (url: string, params?: ReqParamsTypes<T>) => Promise<void>
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useQuery<User>('/api/users/1');
 * 
 * // With parameters
 * const { data, req } = useQuery<Product>('/api/products', {
 *   cachTimeout: 60000,
 *   onSuccess: (data) => console.log('Success!', data),
 *   onError: (error) => console.error('Error!', error),
 * });
 * 
 * // Manual trigger with different URL
 * const handleRefresh = () => req('/api/users/1');
 * ```
 */
export default function useQuery<T = any>(url?:string, params?:ReqParamsTypes<T>):PublicUseQueryReturn<T> {
    // Get global config and cache reference from provider context
    const {config, cashRef} = useProvider()
    
    // Destructure config with fallback values
    let {
        cash,
        baseUrl,
        cashTimeout=30000,
        requestTimeout=30000, 
        onError,
        onSuccess,
        transformError,
        transformResponse, 
        transformHeader,
    } = config || {}
    
    // Initialize state for request lifecycle management
    const [{data, error,isError,isFetching,isLoading,isSuccess}, setState] = useState<State<T>>({
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
    })

    



    /**
     * Initialize hook with parameter overrides
     * Applies any per-request parameter overrides to the global config
     */
    useLayoutEffect(()=>{
        // Override global cache setting if explicitly disabled
        if(typeof params?.useCash === "boolean" && `${params?.useCash}` === "false") {
            cash = params?.useCash
        }
        // Override global cache timeout if provided
        if(params?.cashTimeout) {
            cashTimeout = params?.cashTimeout
        }
        // Override global request timeout if provided
        if(params?.requestTimeout) {
           requestTimeout = params?.requestTimeout
        }
    },[])

    /**
     * Trigger initial fetch when component mounts
     * Fetches data from the provided URL if it exists
     */
    useEffect(()=>{
        // Fetch data immediately if URL is provided
        if(url) req(url, params)
    },[])

    /**
     * Core request function - handles HTTP requests with caching and error management
     * 
     * @param {string} url - The endpoint URL to fetch from
     * @param {ReqParamsTypes} p - Optional request parameters to merge with initial params
     * 
     * Implementation details:
     * 1. Merges URL and per-request parameters
     * 2. Checks cache for GET requests (if caching enabled)
     * 3. Makes HTTP request with timeout management
     * 4. Transforms response/error through transformer functions
     * 5. Updates cache if enabled and request succeeded
     * 6. Calls appropriate callbacks (onSuccess/onError)
     */
    const req = async (url:string , p?:ReqParamsTypes) => {
        // Merge per-request params with initial params (per-request params take precedence)
        const gParams = {...params, ...p}
        
        // Extract request configuration with defaults
        let {
            method = "GET",
            body = undefined,
            headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json'})
        } = gParams || {}

        // Build the full URL
        let mainUrl = ""
        if(baseUrl) {
            mainUrl= baseUrl+url
        }else{
            mainUrl = url
        }

        // Determine cache key - use custom cashId or URL
        let cashId = mainUrl;
        if(gParams?.cashId) {
            cashId = gParams.cashId
        }

        // Mark request as starting
        setState(pre=> ({...pre,isLoading: true}))

        /**
         * CHECK CACHE FIRST
         * Return cached data if:
         * - Caching is enabled globally
         * - User hasn't explicitly disabled caching for this request
         * - Cache entry exists for this URL
         * - Request method is GET (only cache GET requests)
         * - Cache entry hasn't expired (check expiration time)
         */
        if(cash && !(typeof gParams?.useCash ==="boolean" && `${gParams?.useCash}` === "false") && cashRef.current.has(cashId) && method === "GET" && Date.now() <= cashRef.current.get(cashId)?.exp) {
            // Retrieve cached data
            let data = cashRef.current.get(cashId)?.data as T
            
            // Transform cached data through response transformers
            if(transformResponse) {
                data = await transformResponse(data)
            }
            if(gParams?.transformResponse){
                data = await gParams.transformResponse(data)
            }
            
            // Update state with cached data
            setState((pre)=> ({...pre,isLoading: false, data})) 
            
            // Call success callbacks
            gParams?.onSuccess?.(data)
            return
        }

        // Mark fetch operation as in-progress
        setState(pre=> ({...pre,isFetching: true}))
        
        // Set up abort controller for request timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);
        
        try {
            /**
             * TRANSFORM HEADERS
             * Apply any header transformations from global or per-request config
             */
            if(transformHeader) {
                headers = await transformHeader(headers)
            }
            if(gParams?.transformHeader) {
                headers = await gParams.transformHeader(headers)
            }   
            
            /**
             * EXECUTE HTTP REQUEST
             * Use fetch API with:
             * - Configured method (GET, POST, etc.)
             * - Body payload if provided
             * - Transformed headers
             * - credentials: include for cross-origin cookies
             * - Signal for timeout abort
             */
            const res = await fetch(mainUrl, {
                method,
                body,
                headers,
                credentials:"include",
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            /**
             * HANDLE HTTP ERROR RESPONSES
             * Server returned an error status (4xx, 5xx)
             */
            if(!res.ok){
                clearTimeout(timeoutId);
                let e = await res.json()
                
                // Transform error through error transformers
                if(transformError){
                    e = await transformError(e)
                }
                if(gParams?.transformError){
                    e = await gParams.transformError(e)
                }
                
                // Update state with error
                setState(pre => ({...pre, error:e, isError: true, isFetching: false, isLoading: false, isSuccess: false}))
                
                // Call error callbacks
                onError?.(e)
                gParams?.onError?.(e)
                return
            }
            
            /**
             * PROCESS SUCCESSFUL RESPONSE
             * Parse JSON and transform data through transformers
             */
            const result = await res.json()
            let data = result;
            
            // Apply response transformations
            if(transformResponse){
                data = await transformResponse(data)
            }

            if(gParams?.transformResponse){
                data = await gParams.transformResponse( data as T)
            }
            
            /**
             * UPDATE CACHE
             * Store the response in cache with expiration timestamp
             * Cache contains both the data and expiration time
             */
            if(cash) {
                cashRef.current.set(cashId, {data: data, exp: Date.now() + cashTimeout});
            }
            
            // Update state with successful response
            setState(pre=> ({
                ...pre,
                isLoading: false, 
                isFetching:false, 
                isSuccess: true, 
                data: data as T
            }))
            
            // Call success callbacks
            onSuccess?.(data as T)
            gParams?.onSuccess?.(data as T)
            
        } catch (error) {
            /**
             * HANDLE REQUEST ERRORS
             * Catches errors from fetch (network errors, timeouts, etc.)
             */
            clearTimeout(timeoutId);
            let e = error;
            
            // Transform error through error transformers
            if(transformError){
               e = await transformError(e)
            }
            if(gParams?.transformError){
                e = await gParams.transformError(e)
            }
            
            // Update state with error
            setState(pre => ({...pre, error:e, isError: true, isFetching: false, isLoading: false, isSuccess: false}))
            
            // Call error callbacks
            onError?.(e)
            gParams?.onError?.(e)
        }
    }

    /**
     * Return the hook's public API
     * All state values and the manual request function are reactive
     */
    return {
        // Request lifecycle states
        isLoading,    // True during initial request
        isSuccess,    // True when request succeeded
        isFetching,   // True during any request (initial or refetch)
        isError,      // True when request failed
        
        // Result data and error
        error,        // Error object if request failed, null otherwise
        data,         // Response data if successful, null otherwise
        
        // Manual request trigger function
        req,           // Function to manually trigger requests with different URLs/params
    }
}