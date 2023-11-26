import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceiveStatus = () => {
  const queryClient = useQueryClient();

  const ReceiveStatus = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Rec_ID', params || "");
    
    return await httpClient.post("/select_receivestatus", data);
  };

  return useMutation<any, any, any>(
    "ReceiveStatus",
    (params) => ReceiveStatus(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Tag');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useSelectTag = () => {
  const queryClient = useQueryClient();

  const SelectTag = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Rec_ID', params || "");
    

    return await httpClient.post("/select_tag", data);
  };

  return useMutation<any, any, any>(
    "SelectTag",
    (params) => SelectTag(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Tag');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useCreateTag = () => {

  const queryClient = useQueryClient();

  const createTag = async (params: any): Promise<any> => {
    let data = new FormData();

   
    data.append('Rec_NO', params || "");
    

    return await httpClient.post("/create_tag", data);
  };

  return useMutation<any, any, any>(
    "CreateTag",
    (params) => createTag(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Tag');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useDeleteTag = () => {

  const queryClient = useQueryClient();

  const deleteTag = async (params: any): Promise<any> => {

    let data = new FormData();
    data.append('Rec_ID', params || "");

    return await httpClient.post("/delete_tag", data);
  };

  return useMutation<any, any, any>(
    "DeleteTag",
    (params) => deleteTag(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Tag');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useReceiveAuto = () => {

  const queryClient = useQueryClient();

  const ReceiveAuto = async (params: any): Promise<any> => {
    let data = new FormData();

   
    data.append('Rec_ID', params || "");
    

    return await httpClient.post("/receive_auto", data);
  };

  return useMutation<any, any, any>(
    "CreateTag",
    (params) => ReceiveAuto(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Tag');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};