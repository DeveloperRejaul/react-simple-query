'use client';

import { useProvider } from 'provider';
import {useEffect, useState} from 'react'


interface State<T>{
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: any;
    data: T | null;
}
interface ReqParamsTypes {
    method?:"GET" | "POST" | "PUT" | "DELETE";
    body?:any,
    headers?:Headers,
}


export default function useQuery<T = any>(url?:string, prams?:ReqParamsTypes) {
   const {config, cashRef} = useProvider()
   const {cash} = config || {}
   
    const [{data, error,isError,isFetching,isLoading,isSuccess}, setState] = useState<State<T>>({
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
    })

    const req = async (url:string , prams?:ReqParamsTypes) => {
            const {
                method = "GET",
                body = undefined,
                headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json'})
            } = prams || {}
        try {
            setState(pre=> ({...pre,isLoading: true}))

            if(cash && cashRef.current.has(url)) {
                setState((pre)=> ({...pre,isLoading: false, data: cashRef.current.get(url)?.data as T})) 
                return
            }

            setState(pre=> ({...pre,isFetching: true}))
            const res = await fetch(url, {
                method,
                body,
                headers,
                credentials:"include",
            });
            const result = await res.json()
            if(cash) {
                cashRef.current.set(url, {data: result});
            }
            setState(pre=> ({
                ...pre,
                isLoading: false, 
                isFetching:false, 
                isSuccess: true, 
                data: result as T
            }))
        } catch (error) {
            setState(pre => ({...pre, error, isError: true, isFetching: false, isLoading: false, isSuccess: false}))
        }
    }

    useEffect(()=>{
        if(url) {
            req(url, prams)
        }
    },[])

    return {
        isLoading,
        isSuccess,
        isFetching,
        isError,
        error,
        data,
        req
    }
}