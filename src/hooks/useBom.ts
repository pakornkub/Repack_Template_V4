import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useBom = () => {
  const getBom = async () => {
    return await httpClient.get('/bom');
  };
  return useQuery(
    "Bom",
    () => getBom(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};


export const useCreateBom = () => {

  const queryClient = useQueryClient();

  const createBom = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

      return await httpClient.post("/create_bom", data);
  };

  return useMutation<any, any, any>(
    "CreateBom",
    (params) => createBom(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Bom');
       
      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};

export const useUpdateBom = () => {

  const queryClient = useQueryClient();

  const updateBom = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

    return await httpClient.post("/update_bom", data);
  };

  return useMutation<any, any, any>(
    "UpdateBom",
    (params) => updateBom(params),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('Bom');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteBom = () => {

  const queryClient = useQueryClient();

  const deleteBom = async (BOM_ID: any): Promise<any> => {
    
    let data = new FormData();

    data.append('BOM_ID', BOM_ID || "");

    return await httpClient.post("/delete_bom", data);
  };

  return useMutation<any, any, any>(
    "DeleteBom",
    (BOM_ID) => deleteBom(BOM_ID),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('Bom');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useBomItem = () => {
  const getBomItem = async (params: any) => {
    return await httpClient.get('/bom_item?Bom_ID='+params);
  };

  return useMutation<any, any, any>(
    "getBomItem",
    (params) => getBomItem(params),
    {
      onSuccess: (response) => {

        // console.log(response);

      },
      onError: (error) => {

        console.log(error);

      },
    }
  ); 
};