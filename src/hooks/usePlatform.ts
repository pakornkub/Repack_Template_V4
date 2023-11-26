import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const usePlatform = () => {
  const getPlatform = async () => {
    return await httpClient.get('/platform');
  };
  return useQuery(
    "Platform",
    () => getPlatform(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

