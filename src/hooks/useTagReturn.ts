import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceiveStatusReturn = () => {
  const queryClient = useQueryClient();

  const ReceiveStatus = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Rec_ID', params || "");
    
    return await httpClient.post("/select_receivestatusreturn", data);
  };

  return useMutation<any, any, any>(
    "ReceiveStatus",
    (params) => ReceiveStatus(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('TagReturn');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useSelectTagReturn = () => {
  const queryClient = useQueryClient();

  const SelectTag = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Rec_ID', params || "");
    

    return await httpClient.post("/select_tagreturn", data);
  };

  return useMutation<any, any, any>(
    "SelectTag",
    (params) => SelectTag(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('TagReturn');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useCreateTagReturn = () => {

  const queryClient = useQueryClient();

  const CreateTagReturn = async (params: any): Promise<any> => {
    let data = new FormData();

   
    data.append('Rec_NO', params || "");
    

    return await httpClient.post("/create_tagreturn", data);
  };

  return useMutation<any, any, any>(
    "CreateTagReturn",
    (params) => CreateTagReturn(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('TagReturn');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};



export const useDeleteTagReturn = () => {

  const queryClient = useQueryClient();

  const deleteTag = async (params: any): Promise<any> => {

    let data = new FormData();
    data.append('Rec_ID', params || "");

    return await httpClient.post("/delete_tagreturn", data);
  };

  return useMutation<any, any, any>(
    "DeleteTag",
    (params) => deleteTag(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('TagReturn');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};
