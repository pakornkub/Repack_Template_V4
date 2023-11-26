import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useJobRepack = () => {
  const getJobRepack = async () => {
    return await httpClient.get('/jobrepack');
  };
  return useQuery(
    "JobRepack",
    () => getJobRepack(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};


export const useCreateJobRepack = () => {

  const queryClient = useQueryClient();

  const createJobRepack = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");
      data.append('data3',JSON.stringify(params.data3) || "");

      return await httpClient.post("/create_jobrepack", data);
  };

  return useMutation<any, any, any>(
    "CreateJobRepack",
    (params) => createJobRepack(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobRepack');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};

export const useUpdateJobRepack = () => {

  const queryClient = useQueryClient();

  const updateJobRepack = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

    return await httpClient.post("/update_jobrepack", data);
  };

  return useMutation<any, any, any>(
    "UpdateJobRepack",
    (params) => updateJobRepack(params),
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

export const useDeleteJobRepack = () => {

  const queryClient = useQueryClient();

  const deleteJobRepack = async (JobRepack_ID: any): Promise<any> => {
    
    
    let data = new FormData();

    data.append('Rec_ID', JobRepack_ID || "");

    

    return await httpClient.post("/delete_jobrepack", data);
  };

  return useMutation<any, any, any>(
    "DeleteJobRepack",
    (JobRepack_ID) => deleteJobRepack(JobRepack_ID),
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


export const useJobRepackItem = () => {
  const getJobRepackItem = async (params: any) => {
    return await httpClient.get('/jobrepack_item?JobRepack_ID='+params);
  };

  return useMutation<any, any, any>(
    "getJobRepackItem",
    (params) => getJobRepackItem(params),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('JobRepackID');

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};

export const useSelectQRBox = () => {
  const queryClient = useQueryClient();

  const SelectQRBox = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('JOB_ID', params || "");
    

    return await httpClient.post("/select_qrbox", data);
  };

  return useMutation<any, any, any>(
    "SelectQRBox",
    (params) => SelectQRBox(params),
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

export const useSelectWithdrawItem = () => {
  const queryClient = useQueryClient();

  const SelectWithdrawItem = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('JOB_ID', params || "");
    

    return await httpClient.post("/select_withdrawitem", data);
  };

  return useMutation<any, any, any>(
    "SelectWithdrawItem",
    (params) => SelectWithdrawItem(params),
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