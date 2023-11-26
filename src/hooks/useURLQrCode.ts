import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useURLQrCode = () => {
  const getURLQrCode = async () => {
    return await httpClient.get('/url_qrcode');
  };
  return useQuery(
    "URLQrCode",
    () => getURLQrCode(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

