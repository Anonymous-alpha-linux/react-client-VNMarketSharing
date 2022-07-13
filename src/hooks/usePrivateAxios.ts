import React from "react";
import { useTypedSelector } from "./useTypedSelector";
import { axiosInstance } from "../api";

export default function usePrivateAxios() {
   const { data, loading, error } = useTypedSelector((state) => state.auth);

   return axiosInstance;
}
