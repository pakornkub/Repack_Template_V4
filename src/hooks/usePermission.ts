import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const usePermission = (params: any) => {
  const getPermission = async (params: any) => {

    return await httpClient.get(`/permission?Platform=${params?.Platform || ''}&User_Group=${params?.User_Group || ''}&User_Group_Value=${params?.User_Group_Value || ''}`);
  };
  return useQuery(
    ["Permission", params],
    () => getPermission(params),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreatePermission = () => {

  const queryClient = useQueryClient();

  const createPermission = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params.filter).forEach((value) => {

      data.append(value, params.filter[value] || "");
    });

    data.append('Items', JSON.stringify(params.items) || "");

    return await httpClient.post("/create_permission", data);
  };

  return useMutation<any, any, any>(
    "CreatePermission",
    (params) => createPermission(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Permission');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


