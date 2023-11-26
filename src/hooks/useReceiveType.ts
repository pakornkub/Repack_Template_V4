import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceiveType = () => {
  const getReceiveType = async () => {
    return await httpClient.get('/receive_type');
  };
  return useQuery(
    "ReceiveType",
    () => getReceiveType(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

