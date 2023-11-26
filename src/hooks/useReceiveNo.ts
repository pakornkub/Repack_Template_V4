import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";


export const useReceiveNo = () => {
  const getReceiveNo = async (params: any) => {
    return await httpClient.get('/receive_no?type='+params);
  };

  return useMutation<any, any, any>(
    "getReceiveNo",
    (params) => getReceiveNo(params),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('BomID');

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};
