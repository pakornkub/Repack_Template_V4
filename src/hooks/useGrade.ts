import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useGrade = () => {
  const getGrade = async () => {
    return await httpClient.get('/grade');
  };
  return useQuery(
    "Grade",
    () => getGrade(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};

export const useCreateGrade = () => {

  const queryClient = useQueryClient();

  const createGrade = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });


    return await httpClient.post("/create_grade", data);
  };

  return useMutation<any, any, any>(
    "CreateGrade",
    (params) => createGrade(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Grade');

    },
      onError: (error) => {

        console.log(error);


      },
    }
  );
};

export const useUpdateGrade = () => {

  const queryClient = useQueryClient();

  const updateGrade = async (params: any): Promise<any> => {
    let data = new FormData();

    Object.keys(params).forEach((value) => {
      data.append(value, params[value] || "");
    });

    return await httpClient.post("/update_grade", data);
  };

  return useMutation<any, any, any>(
    "UpdateGrade",
    (params) => updateGrade(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Grade');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteGrade = () => {

  const queryClient = useQueryClient();

  const deleteGrade = async (Grade_Index: any): Promise<any> => {

    let data = new FormData();

    data.append('Grade_Index', Grade_Index || "");

    return await httpClient.post("/delete_grade", data);
  };

  return useMutation<any, any, any>(
    "DeleteGrade",
    (Grade_Index) => deleteGrade(Grade_Index),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Grade');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
