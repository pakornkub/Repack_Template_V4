import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useGradeFG = () => {
  const getGradeFG = async () => {
    return await httpClient.get('/grade_fg');
  };
  return useQuery(
    "GradeFG",
    () => getGradeFG(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

