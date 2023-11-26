import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";




export const useReprintQrCode = () => {
  const queryClient = useQueryClient();

  const ReprintQrCode = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Qrcode', params || "");
    

    return await httpClient.post("/reprintqrcode", data);
  };

  return useMutation<any, any, any>(
    "ReprintQrCode",
    (params) => ReprintQrCode(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Reprint');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
