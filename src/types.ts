export interface ConfigType{
    cash?:boolean,
    requestTimeout?:number
    cashTimeout?:number
    baseUrl:string
    onError?:(error:any)=>void | Promise<void>
    onSuccess?:(data:any)=>void | Promise<void>
    transformResponse?:(data:any)=>any | Promise<any>
    transformError?:(error:any)=>any | Promise<any>
    transformHeader?:(data:Headers)=>Headers | Promise<Headers>
}

export interface ContextType {
    config: ConfigType,
    cashRef: React.RefObject<Map<string, any>>
}

export type PropsType = {
  children: React.ReactNode;
  config: ConfigType;
}
export interface IHelper {
    addCash: (id: string, data: any) => void;
    clearCash: () => void;
    getCash: () => Map<string, any>;
    getCashByUrl: (url: string) => void;
    updateCashByUrl: (url: string, data: any) => void;
    baseUrl: string;
}


export interface State<T>{
    isLoading: boolean;
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: any;
    data: T | null;
}
export interface ReqParamsTypes<T = any> {
    method?:"GET" | "POST" | "PUT" | "DELETE";
    body?:T,
    headers?:Headers,
    useCash?:boolean;
    cashTimeout?:number;
    requestTimeout?:number
    cashId?:string;
    onError?:(error:any)=>void | Promise<void>
    onSuccess?:(data:T)=>void | Promise<void>
    transformResponse?:(data:T)=> any | Promise<any>
    transformError?:(error:any)=> any | Promise<any>
    transformHeader?:(data:Headers)=>Headers | Promise<Headers>
}
