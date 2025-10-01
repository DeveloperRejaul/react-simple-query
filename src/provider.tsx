'use client';

import {createContext, useContext, useLayoutEffect, useRef} from 'react'
import { ConfigType, ContextType, IHelper, PropsType } from 'types';




const Context = createContext<ContextType>({} as ContextType)

export const helper:IHelper = {
    addCash: (id:string, data:any)=>{},
    clearCash : () => {},
    getCash: ():Map<string, any> => new Map(),
    getCashByUrl: (url:string) => {},
    updateCashByUrl: (url:string, data:any) => {},
    baseUrl:"",
}

export default function QueryProvider ({children, config:c}:PropsType) {
    const cashRef = useRef(new Map())

    const config:ConfigType = {
        cash: true,
        cashTimeout: 30000,
        requestTimeout: 30000,
        ...c
    }

    useLayoutEffect(()=>{
        helper.clearCash = function (){
            cashRef.current = new Map()
        }
        helper.getCash = function () {
            return cashRef.current
        }
        helper.getCashByUrl = function (url) {
            return cashRef.current.get(url)
        }
        helper.updateCashByUrl = function (url, data) {
           cashRef.current.set(url, data)
        } 
        helper.addCash = function (url, data) {
           cashRef.current.set(url, data)
        }
        helper.baseUrl = config.baseUrl;
    },[])
    return (
        <Context.Provider value={{config, cashRef}}>
            {children}
        </Context.Provider>
    ) 
}


export const useProvider = ()=> useContext(Context)