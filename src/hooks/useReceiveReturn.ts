import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceiveReturn = () => {
  const getReceiveReturn = async () => {
    return await httpClient.get('/receivereturn');
  };
  return useQuery(
    "ReceiveReturn",
    () => getReceiveReturn(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};


export const useCreateReceiveReturn = () => {

  const queryClient = useQueryClient();

  const createReceiveReturn = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

      return await httpClient.post("/create_receivereturn", data);
  };

  return useMutation<any, any, any>(
    "CreateReceiveReturn",
    (params) => createReceiveReturn(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceiveReturn');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};

export const useUpdateReceiveReturn = () => {

  const queryClient = useQueryClient();

  const updateReceiveReturn = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

    return await httpClient.post("/update_receivereturn", data);
  };

  return useMutation<any, any, any>(
    "UpdateReceiveReturn",
    (params) => updateReceiveReturn(params),
    {
      onSuccess: (response) => {
        // console.log('UpdateReceiveReturn =',response);
        queryClient.invalidateQueries('ReceiveReturn');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteReceiveReturn = () => {

  const queryClient = useQueryClient();

  const deleteReceiveReturn = async (ReceiveReturn_ID: any): Promise<any> => {
    
    
    let data = new FormData();

    data.append('Rec_ID', ReceiveReturn_ID || "");

    

    return await httpClient.post("/delete_receivereturn", data);
  };

  return useMutation<any, any, any>(
    "DeleteReceiveReturn",
    (ReceiveReturn_ID) => deleteReceiveReturn(ReceiveReturn_ID),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceiveReturn');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useReceiveReturnItem = () => {
  const getReceiveReturnItem = async (params: any) => {

    return await httpClient.get('/receivereturn_item?ReceiveReturn_ID='+params);
  };

  return useMutation<any, any, any>(
    "getReceiveReturnItem",
    (params) => getReceiveReturnItem(params),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('ReceiveReturnID');

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};