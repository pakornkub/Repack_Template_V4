import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";


export const useJobNo = () => {
  const getJobNo = async (params: any) => {
    return await httpClient.get('/job_no?type='+params);
  };

  return useMutation<any, any, any>(
    "getJobNo",
    (params) => getJobNo(params),
    {
      onSuccess: (response) => {

        //  console.log(response);

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};
