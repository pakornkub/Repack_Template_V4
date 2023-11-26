import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useBomID = () => {
  const getBomID = async (params: any) => {
    return await httpClient.get('/bomid?Grade_Id='+params);
  };

  return useMutation<any, any, any>(
    "getBomID",
    (params) => getBomID(params),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('BomID');
        // console.log(response);

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};



