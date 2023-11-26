import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useGradeSP = () => {
  const getGradeSP = async () => {
    return await httpClient.get('/grade_sp');
  };
  return useQuery(
    "GradeSP",
    () => getGradeSP(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

