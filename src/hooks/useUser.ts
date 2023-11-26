import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useUser = () => {
  const getUser = async () => {
    return await httpClient.get('/user');
  };
  return useQuery(
    "User",
    () => getUser(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreateUser = () => {

  const queryClient = useQueryClient();

  const createUser = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/create_user", data);
  };

  return useMutation<any, any, any>(
    "CreateUser",
    (params) => createUser(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('User');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateUser = () => {

  const queryClient = useQueryClient();

  const updateUser = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_user", data);
  };

  return useMutation<any, any, any>(
    "UpdateUser",
    (params) => updateUser(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('User');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteUser = () => {

  const queryClient = useQueryClient();

  const deleteUser = async (User_Index: any): Promise<any> => {

    let data = new FormData();

    data.append('User_Index', User_Index || "");

    return await httpClient.post("/delete_user", data);
  };

  return useMutation<any, any, any>(
    "DeleteUser",
    (User_Index) => deleteUser(User_Index),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('User');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
