import { AxiosResponse } from "axios";

export interface BaseResponse<T> extends AxiosResponse<T> {}
