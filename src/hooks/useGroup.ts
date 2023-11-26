import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useGroup = () => {
  const getGroup = async () => {
    return await httpClient.get('/group');
  };
  return useQuery(
    "Group",
    () => getGroup(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreateGroup = () => {

  const queryClient = useQueryClient();

  const createGroup = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/create_group", data);
  };

  return useMutation<any, any, any>(
    "CreateGroup",
    (params) => createGroup(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Group');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateGroup = () => {

  const queryClient = useQueryClient();

  const updateGroup = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_group", data);
  };

  return useMutation<any, any, any>(
    "UpdateGroup",
    (params) => updateGroup(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Group');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteGroup = () => {

  const queryClient = useQueryClient();

  const deleteGroup = async (Group_Index: any): Promise<any> => {

    let data = new FormData();

    data.append('Group_Index', Group_Index || "");

    return await httpClient.post("/delete_group", data);
  };

  return useMutation<any, any, any>(
    "DeleteGroup",
    (Group_Index) => deleteGroup(Group_Index),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Group');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
