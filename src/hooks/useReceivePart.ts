import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useReceivePart = () => {
  const getReceivePart = async () => {
    return await httpClient.get('/receivepart');
  };
  return useQuery(
    "ReceivePart",
    () => getReceivePart(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};


export const useCreateReceivePart = () => {

  const queryClient = useQueryClient();

  const createReceivePart = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

      return await httpClient.post("/create_receivepart", data);
  };

  return useMutation<any, any, any>(
    "CreateReceivePart",
    (params) => createReceivePart(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceivePart');
      
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};

export const useUpdateReceivePart = () => {

  const queryClient = useQueryClient();

  const updateReceivePart = async (params: any): Promise<any> => {
    
    // console.log('PARA =',params);
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

    return await httpClient.post("/update_receivepart", data);
  };

  return useMutation<any, any, any>(
    "UpdateReceivePart",
    (params) => updateReceivePart(params),
    {
      onSuccess: (response) => {
        // console.log('UpdateReceivePart =',response);
        queryClient.invalidateQueries('ReceivePart');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteReceivePart = () => {

  const queryClient = useQueryClient();

  const deleteReceivePart = async (ReceivePart_ID: any): Promise<any> => {
    
    
    let data = new FormData();

    data.append('Rec_ID', ReceivePart_ID || "");

    

    return await httpClient.post("/delete_receivepart", data);
  };

  return useMutation<any, any, any>(
    "DeleteReceivePart",
    (ReceivePart_ID) => deleteReceivePart(ReceivePart_ID),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('ReceivePart');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useReceivePartItem = () => {
  const getReceivePartItem = async (params: any) => {
    return await httpClient.get('/receivepart_item?ReceivePart_ID='+params);
  };

  return useMutation<any, any, any>(
    "getReceivePartItem",
    (params) => getReceivePartItem(params),
    {
      onSuccess: (response) => {

        // queryClient.invalidateQueries('ReceivePartID');

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};