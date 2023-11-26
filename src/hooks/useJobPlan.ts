import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useJobPlan = () => {
  const getJobPlan = async () => {
    return await httpClient.get('/jobplan');
  };
  return useQuery(
    "JobPlan",
    () => getJobPlan(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};


export const useCreateJobPlan = () => {

  const queryClient = useQueryClient();

  const createJobPlan = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data',JSON.stringify(params.data) || "");


    // for(let [name, value] of data) {
    //     alert(`${name} = ${value}`);
    //   }

      return await httpClient.post("/create_jobplan", data);
  };

  return useMutation<any, any, any>(
    "CreateJobPlan",
    (params) => createJobPlan(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobPlan');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};

export const useUpdateJobPlan = () => {

  const queryClient = useQueryClient();

  const updateJobPlan = async (params: any): Promise<any> => {
    
    // console.log('PARA =',params);
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

    return await httpClient.post("/update_jobplan", data);
  };

  return useMutation<any, any, any>(
    "UpdateJobPlan",
    (params) => updateJobPlan(params),
    {
      onSuccess: (response) => {
        
        queryClient.invalidateQueries('JobPlan');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteJobPlan = () => {

  const queryClient = useQueryClient();

  const deleteJobPlan = async (JobPlan_ID: any): Promise<any> => {
    
    
    let data = new FormData();

    data.append('JobPlan_ID', JobPlan_ID || "");

    

    return await httpClient.post("/delete_jobplan", data);
  };

  return useMutation<any, any, any>(
    "DeleteJobPlan",
    (JobPlan_ID) => deleteJobPlan(JobPlan_ID),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('JobPlan');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


