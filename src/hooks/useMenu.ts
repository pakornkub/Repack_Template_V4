import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useMenu = () => {
  const getMenu = async () => {
    return await httpClient.get('/menu');
  };
  return useQuery(
    "Menu",
    () => getMenu(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreateMenu = () => {

  const queryClient = useQueryClient();

  const createMenu = async (params: any): Promise<any> => {

    let data = new FormData();

    Object.keys(params).forEach((value) => {
      if (value === 'Picture') {
        data.append(value, params[value] && params[value] != undefined ? params[value]['fileList'][0]?.originFileObj || "" : "");
      } else {
        data.append(value, params[value] || "");
      }
    });

    return await httpClient.post("/create_menu", data);
  };

  return useMutation<any, any, any>(
    "CreateMenu",
    (params) => createMenu(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Menu');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useUpdateMenu = () => {

  const queryClient = useQueryClient();

  const updateMenu = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      if (value === 'Picture') {
        data.append(value, params[value] && params[value] != undefined ? params[value][0] ? "" : params[value]['fileList'][0]?.originFileObj || "" : "");
        data.append('Old_Picture', params[value] && params[value] != undefined ? params[value][0] ? params[value][0].uid : "" : "");
      } else {
        data.append(value, params[value] || "");
      }
    });

    return await httpClient.post("/update_menu", data);
  };

  return useMutation<any, any, any>(
    "UpdateMenu",
    (params) => updateMenu(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Menu');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteMenu = () => {

  const queryClient = useQueryClient();

  const deleteMenu = async (params: any): Promise<any> => {

    let data = new FormData();

    Object.keys(params).forEach((value) => {

      data.append(value, params[value] || "");

    });

    return await httpClient.post("/delete_menu", data);
  };

  return useMutation<any, any, any>(
    "DeleteMenu",
    (params) => deleteMenu(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Menu');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useParentMenu = () => {

  const queryClient = useQueryClient();

  const parentMenu = async (): Promise<any> => {

    return await httpClient.get("/parent_menu");
  };

  return useMutation<any, any>(
    "ParentMenu",
    () => parentMenu(),
    {
      onSuccess: (response) => {

        //queryClient.invalidateQueries('Menu');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
