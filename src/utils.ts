import { helper } from "provider";

export const clearCash = () => helper.clearCash()
export const getCash = () => helper.getCash()
export const getCashByUrl = (url:string) => helper.getCashByUrl(url)
export const updateCashByUrl = (url:string, data:any) => helper.updateCashByUrl(url, data)
export const addCash = (id:string, data:any) => helper.addCash(id, data)

