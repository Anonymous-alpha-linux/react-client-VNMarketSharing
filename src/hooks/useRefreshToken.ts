import React from "react";
import { useActions } from "./useAction";
import { useTypedSelector } from "./useTypedSelector";

export default function useRefreshToken() {
   const { refreshToken } = useActions();
   const { data, loading, error } = useTypedSelector((state) => state.auth);

   React.useEffect(() => {
      refreshToken();
   }, []);
}
