'use client';

import {createContext, useContext, useRef} from 'react'


export interface ConfigType{
    cash?:boolean
}

interface ContextType {
    config: ConfigType,
    cashRef: React.RefObject<Map<string, any>>
}

type PropsType = {
  children: React.ReactNode;
  config: ConfigType;
}

const Context = createContext<ContextType>({} as ContextType)


export default function QueryProvider ({children, config:c}:PropsType) {
    const cashRef = useRef(new Map())

    const config = {
        cash: true,
        ...c
    }

    return (
        <Context.Provider value={{config, cashRef}}>
            {children}
        </Context.Provider>
    ) 
}


export const useProvider = ()=> useContext(Context)