/**
 * @fileoverview React Simple Query - A lightweight data fetching and caching library for React
 * 
 * This is the main entry point for the React Simple Query library.
 * It exports all public APIs including hooks, provider, and utility functions.
 * 
 * @packageDocumentation
 */

'use client'

/**
 * Hook for fetching and caching data from API endpoints
 * @see useQuery
 */
export { default as useQuery} from "./useQuery"

/**
 * Hook for executing mutations (POST, PUT, DELETE operations)
 * @see useMutation
 */
export { default as useMutation} from "./useMutation"

/**
 * Context provider that manages global configuration and cache state
 * Must wrap the application to enable useQuery and useMutation hooks
 * @see QueryProvider
 */
export { default as QueryProvider} from "./provider"

/**
 * Utility functions for cache management (clearCash, getCash, etc.)
 * @see utils
 */
export * from "./utils"