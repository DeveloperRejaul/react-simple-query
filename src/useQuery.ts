'use client';

import { useProvider } from 'provider';
import {useEffect, useLayoutEffect, useState} from 'react'
import { ReqParamsTypes, State } from 'types';


export default function useQuery<T = any>(url?:string, params?:ReqParamsTypes<T>) {
    const {config, cashRef} = useProvider()
    let {cash,baseUrl,cashTimeout=30000,requestTimeout=30000, onError,onSuccess,transformError,transformResponse, transformHeader} = config || {}
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
        // this call when use useQuery
        if(url) req(url, params)
    },[])

    const req = async (url:string , p?:ReqParamsTypes) => {
        const gParams = {...params, ...p}
        let {
            method = "GET",
            body = undefined,
            headers = new Headers({ 'Content-Type': 'application/json', Accept: 'application/json'})
        } = gParams || {}

        let mainUrl = ""
        if(baseUrl) {
            mainUrl= baseUrl+url
        }else{
            mainUrl = url
        }

        let cashId = mainUrl;
        if(gParams?.cashId) {
            cashId = gParams.cashId
        }

        setState(pre=> ({...pre,isLoading: true}))

        if(cash && !(typeof gParams?.useCash ==="boolean" && `${gParams?.useCash}` === "false") && cashRef.current.has(cashId) && method === "GET" && Date.now() <= cashRef.current.get(cashId)?.exp) {
            let data = cashRef.current.get(cashId)?.data as T
            if(transformResponse) {
                data = await transformResponse(data)
            }
            if(gParams?.transformResponse){
                data = await gParams.transformResponse(data)
            }
            setState((pre)=> ({...pre,isLoading: false, data})) 
            gParams?.onSuccess?.(data)
            return
        }

        setState(pre=> ({...pre,isFetching: true}))
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);
        try {
            // handle header
            if(transformHeader) {
                headers = await transformHeader(headers)
            }
            if(gParams?.transformHeader) {
                headers = await gParams.transformHeader(headers)
            }   
            
            const res = await fetch(mainUrl, {
                method,
                body,
                headers,
                credentials:"include",
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const result = await res.json()
            let data = result;
            if(transformResponse){
               data = await transformResponse(data)
            }
            if(gParams?.transformResponse){
                data = await gParams.transformResponse( data as T)
            }
            if(cash) {
                cashRef.current.set(cashId, {data: data, exp: Date.now() + cashTimeout});
            }
            setState(pre=> ({
                ...pre,
                isLoading: false, 
                isFetching:false, 
                isSuccess: true, 
                data: data as T
            }))
            onSuccess?.(data as T)
            gParams?.onSuccess?.(data as T)
        } catch (error) {
            clearTimeout(timeoutId);
            let e = error;
            if(transformError){
               e = await transformError(e)
            }
            if(gParams?.transformError){
                e = await gParams.transformError(e)
            }
            setState(pre => ({...pre, error:e, isError: true, isFetching: false, isLoading: false, isSuccess: false}))
            onError?.(e)
            gParams?.onError?.(e)
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