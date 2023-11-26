import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useMenuType = () => {
  const getMenuType = async () => {
    return await httpClient.get('/menu_type');
  };
  return useQuery(
    "MenuType",
    () => getMenuType(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

