export interface Response<TData> {
   data: TData;
   status: string;
   statusCode: number;
   message: string;
   serverMessage: string;
}
