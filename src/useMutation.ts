/**
 * @fileoverview useMutation Hook - Data mutation hook for POST, PUT, DELETE requests
 * 
 * This module exports the useMutation hook which handles mutations without requiring
 * an initial URL. Mutations are triggered manually through the req function.
 * 
 * @module useMutation
 */

'use client'

import { ReqParamsTypes } from "types";
import useQuery from "useQuery";

/**
 * useMutation Hook - Execute mutations without automatic fetching
 * 
 * Similar to useQuery but designed for mutations (POST, PUT, DELETE).
 * Doesn't fetch data on mount - mutations are triggered manually via the req function.
 * 
 * Inherits all caching, timeout, and error handling capabilities from useQuery.
 * 
 * @template T The type of data returned by the mutation endpoint
 * @param {ReqParamsTypes<T>} [params] Optional configuration for the mutation
 * 
 * @returns {Object} Same as useQuery - state and req function for triggering mutations
 * @returns {boolean} .isLoading True during request
 * @returns {boolean} .isFetching True during request
 * @returns {boolean} .isSuccess True when request succeeded
 * @returns {boolean} .isError True when request failed
 * @returns {any} .error Error object if failed
 * @returns {T|null} .data Response data if successful
 * @returns {Function} .req Mutation function: (url: string, params?: ReqParamsTypes<T>) => Promise<void>
 * 
 * @example
 * ```tsx
 * // Create user mutation
 * const { data, isLoading, error, req } = useMutation<User>({
 *   method: 'POST',
 *   onSuccess: (user) => console.log('User created:', user),
 * });
 * 
 * // Trigger mutation
 * const handleCreateUser = async () => {
 *   req('/api/users', {
 *     body: { name: 'John', email: 'john@example.com' }
 *   });
 * };
 * ```
 */
export default <T = any>(params?: ReqParamsTypes) => useQuery(undefined, params)