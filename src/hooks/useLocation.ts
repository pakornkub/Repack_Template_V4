import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useLocation = () => {
  const getLocation = async () => {
    return await httpClient.get('/location');
  };
  return useQuery(
    "Location",
    () => getLocation(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

