import React from "react";
import axios, { AxiosError } from "axios";
import { useActions } from "./useAction";
import { useTypedSelector } from "./useTypedSelector";

export function axiosErrorHandler(
   axiosError: Error | AxiosError,
   callback: Function
) {}
