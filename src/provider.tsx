/**
 * @fileoverview Query Provider - Context-based state management for React Simple Query
 * 
 * This module provides the QueryProvider component and useProvider hook that manage
 * global configuration, cache state, and provide a context for useQuery and useMutation hooks.
 * 
 * @module provider
 */

'use client';

import {createContext, useContext, useLayoutEffect, useRef} from 'react'
import { ConfigType, ContextType, IHelper, PropsType } from 'types';

/**
 * React Context for sharing query configuration and cache across the application
 * @internal
 */
const Context = createContext<ContextType>({} as ContextType)

/**
 * Global helper object that provides cache management utilities
 * These methods are initialized when QueryProvider mounts and remain available
 * throughout the application lifecycle
 * 
 * @see {@link IHelper} for available methods
 */
export const helper:IHelper = {
    /** Add item to cache (initialized by provider) */
    addCash: (id:string, data:any)=>{},
    /** Clear all cache items (initialized by provider) */
    clearCash : () => {},
    /** Get entire cache Map (initialized by provider) */
    getCash: ():Map<string, any> => new Map(),
    /** Get cached item by URL (initialized by provider) */
    getCashByUrl: (url:string) => {},
    /** Update cached item by URL (initialized by provider) */
    updateCashByUrl: (url:string, data:any) => {},
    /** Base URL for all requests */
    baseUrl:"",
}

/**
 * QueryProvider Component
 * 
 * Wraps your React application to provide query and mutation capabilities.
 * Must be placed at the top level of your app or above components using useQuery/useMutation.
 * 
 * @param {PropsType} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to query context
 * @param {ConfigType} props.config - Configuration object for query behavior
 * 
 * @returns {JSX.Element} Context provider wrapping children
 * 
 * @example
 * ```tsx
 * const config = {
 *   baseUrl: 'https://api.example.com',
 *   cash: true,
 *   cashTimeout: 30000,
 *   requestTimeout: 30000,
 * };
 * 
 * export default function App() {
 *   return (
 *     <QueryProvider config={config}>
 *       <YourComponent />
 *     </QueryProvider>
 *   );
 * }
 * ```
 */
export default function QueryProvider ({children, config:c}:PropsType) {
    // Reference to the cache Map - persists across re-renders
    const cashRef = useRef(new Map())

    // Merge user config with defaults
    const config:ConfigType = {
        cash: true,
        cashTimeout: 30000,
        requestTimeout: 30000,
        ...c
    }

    /**
     * Initialize helper methods with the actual cache ref
     * Runs once on component mount to set up cache management utilities
     */
    useLayoutEffect(()=>{
        // Clear all cached items
        helper.clearCash = function (){
            cashRef.current = new Map()
        }
        
        // Retrieve the entire cache Map
        helper.getCash = function () {
            return cashRef.current
        }
        
        // Get a specific cached item by URL
        helper.getCashByUrl = function (url) {
            return cashRef.current.get(url)
        }
        
        // Update an existing cached item
        helper.updateCashByUrl = function (url, data) {
           cashRef.current.set(url, data)
        } 
        
        // Add a new item to the cache
        helper.addCash = function (url, data) {
           cashRef.current.set(url, data)
        }
        
        // Set the base URL
        helper.baseUrl = config.baseUrl;
    },[])
    
    return (
        <Context.Provider value={{config, cashRef}}>
            {children}
        </Context.Provider>
    ) 
}

/**
 * Hook to access the query context within QueryProvider
 * 
 * Retrieves the global configuration and cache reference from the nearest QueryProvider.
 * Should only be used within components that are wrapped by QueryProvider.
 * 
 * @returns {ContextType} Object containing config and cashRef
 * @throws {Error} When used outside of QueryProvider scope
 * 
 * @internal
 * @see useQuery
 * @see useMutation
 */
export const useProvider = ()=> useContext(Context)