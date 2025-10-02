'use client';

import { useProvider } from 'provider';
import {useEffect, useLayoutEffect, useState} from 'react'
import { ReqParamsTypes, State } from 'types';


export default function useQuery<T = any>(url?:string, params?:ReqParamsTypes) {
    const {config, cashRef} = useProvider()
    let {cash,baseUrl,cashTimeout=30000,requestTimeout=30000} = config || {}
    const [{data, error,isError,isFetching,isLoading,isSuccess}, setState] = useState<State<T>>({
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: null,
    })


    useLayoutEffect(()=>{
        if(typeof params?.useCash === "boolean" && `${params?.useCash}` === "false") {
            cash = params?.useCash
        }
        if(params?.cashTimeout) {
            cashTimeout = params?.cashTimeout
        }
        if(params?.requestTimeout) {
           requestTimeout = params?.requestTimeout
        }
    },[])


    useEffect(()=>{
        if(url) req(url, params)
    },[])

    const req = async (url:string , params?:ReqParamsTypes) => {
        const {
            method = "GET",
            body = undefined,
            headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json'})
        } = params || {}

        let mainUrl = ""
        if(baseUrl) {
            mainUrl= baseUrl+url
        }else{
            mainUrl = url
        }

        let cashId = mainUrl;
        if(params?.cashId) {
            cashId = params.cashId
        }

        setState(pre=> ({...pre,isLoading: true}))

        if(cash && !(typeof params?.useCash ==="boolean" && `${params?.useCash}` === "false") && cashRef.current.has(cashId) && method === "GET" && Date.now() <= cashRef.current.get(cashId)?.exp) {
            setState((pre)=> ({...pre,isLoading: false, data: cashRef.current.get(cashId)?.data as T})) 
            return
        }

        setState(pre=> ({...pre,isFetching: true}))
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);
        try {
            const res = await fetch(mainUrl, {
                method,
                body,
                headers,
                credentials:"include",
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json()
            if(cash) {
                cashRef.current.set(cashId, {data: result, exp: Date.now() + cashTimeout});
            }
            setState(pre=> ({
                ...pre,
                isLoading: false, 
                isFetching:false, 
                isSuccess: true, 
                data: result as T
            }))
        } catch (error) {
            clearTimeout(timeoutId);
            setState(pre => ({...pre, error, isError: true, isFetching: false, isLoading: false, isSuccess: false}))
        }
    }


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