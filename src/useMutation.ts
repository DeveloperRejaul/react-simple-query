'use client'

import { ReqParamsTypes } from "types";
import useQuery from "useQuery";
export default <T = any>(params?: ReqParamsTypes) => useQuery(undefined, params)