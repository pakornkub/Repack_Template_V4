import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useBomForJob = () => {
  const getBomForJob = async () => {
    return await httpClient.get('/bomforjob');
  };
  return useQuery(
    "BomForJob",
    () => getBomForJob(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useGradePlan = () => {
  const queryClient = useQueryClient();

  const SelectGradePlan = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('DATE', params || "");
    

    return await httpClient.post("/select_gradeplan", data);
  };

  return useMutation<any, any, any>(
    "SelectGradePlan",
    (params) => SelectGradePlan(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobRepack');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useBomRev = () => {
  const queryClient = useQueryClient();

  const SelectBomRev = async (params: any): Promise<any> => {
    let data = new FormData();
    data.append('GRADE_ID', params || "");
    

    return await httpClient.post("/select_bomrev", data);
  };

  return useMutation<any, any, any>(
    "SelectBomRev",
    (params) => SelectBomRev(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobRepack');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useBomItem = () => {
  const queryClient = useQueryClient();

  const SelectBomItem = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('BOM_ID', params || "");
    

    return await httpClient.post("/select_bomitem", data);
  };

  return useMutation<any, any, any>(
    "SelectBomItem",
    (params) => SelectBomItem(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobRepack');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};