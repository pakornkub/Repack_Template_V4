import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useProductType = () => {
  const getProductType = async () => {
    return await httpClient.get('/producttype');
  };
  return useQuery(
    "ProductType",
    () => getProductType(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

