export type ResponseData<T = any> = {
  data: T;
  message: string;
  status: number;
};

export type ResponseList<T = any> = ResponseData<Array<T>>;
export type ResponseItem<T = any> = ResponseData<T>;
