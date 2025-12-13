/**
 * @fileoverview Cache Management Utilities
 * 
 * This module exports utility functions for managing the global cache outside of
 * React components. These functions allow direct manipulation of cached data without
 * going through the useQuery/useMutation hooks.
 * 
 * @module utils
 */

'use client'

import { helper } from "provider";

/**
 * Clear all cached items
 * 
 * Removes all entries from the cache, forcing fresh API calls on the next request.
 * Useful for scenarios like user logout where cached data should be invalidated.
 * 
 * @returns {void}
 * 
 * @example
 * ```typescript
 * import { clearCash } from 'react-simple-query';
 * 
 * // Clear cache on logout
 * const handleLogout = () => {
 *   clearCash();
 *   // Redirect to login...
 * };
 * ```
 */
export const clearCash = () => helper.clearCash()

/**
 * Retrieve the entire cache Map
 * 
 * Returns a reference to the full cache storage. Cache entries are stored as:
 * ```
 * Map<string, { data: any, exp: number }>
 * ```
 * where exp is the expiration timestamp in milliseconds.
 * 
 * @returns {Map<string, any>} The complete cache Map
 * 
 * @example
 * ```typescript
 * import { getCash } from 'react-simple-query';
 * 
 * const cache = getCash();
 * console.log(cache.size); // Number of cached entries
 * cache.forEach((value, key) => {
 *   console.log(key, value.data, value.exp);
 * });
 * ```
 */
export const getCash = () => helper.getCash()

/**
 * Retrieve a cached item by URL
 * 
 * Gets the cache entry for a specific URL, returning both the cached data
 * and its expiration timestamp.
 * 
 * @param {string} url - The URL key to look up in the cache
 * @returns {any} The cached entry object { data: any, exp: number } or undefined
 * 
 * @example
 * ```typescript
 * import { getCashByUrl } from 'react-simple-query';
 * 
 * const cachedUser = getCashByUrl('/api/users/1');
 * if (cachedUser && Date.now() <= cachedUser.exp) {
 *   console.log('Cache hit:', cachedUser.data);
 * } else {
 *   console.log('Cache expired or not found');
 * }
 * ```
 */
export const getCashByUrl = (url:string) => helper.getCashByUrl(url)

/**
 * Update an existing cached entry by URL
 * 
 * Modifies the cache entry for a given URL. Useful for optimistic updates
 * or manual cache synchronization after mutations.
 * 
 * @param {string} url - The URL key to update
 * @param {any} data - The new data to store in the cache
 * @returns {void}
 * 
 * @example
 * ```typescript
 * import { updateCashByUrl } from 'react-simple-query';
 * 
 * // Optimistic update after creating a user
 * const newUser = { id: 123, name: 'John' };
 * updateCashByUrl('/api/users', newUser);
 * ```
 */
export const updateCashByUrl = (url:string, data:any) => helper.updateCashByUrl(url, data)

/**
 * Add a new item to the cache
 * 
 * Manually adds or overwrites a cache entry with a custom ID.
 * Useful for populating cache with pre-loaded data or updating cache manually.
 * 
 * @param {string} id - Custom cache key (usually a URL)
 * @param {any} data - The data to cache
 * @returns {void}
 * 
 * @example
 * ```typescript
 * import { addCash } from 'react-simple-query';
 * 
 * // Pre-populate cache with initial data
 * addCash('/api/config', {
 *   theme: 'dark',
 *   language: 'en'
 * });
 * 
 * // Later requests will use this cached data
 * ```
 */
export const addCash = (id:string, data:any) => helper.addCash(id, data)

