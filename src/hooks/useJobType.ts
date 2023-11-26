import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useJobType = () => {
  const getJobType = async () => {
    return await httpClient.get('/job_type');
  };
  return useQuery(
    "JobType",
    () => getJobType(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

