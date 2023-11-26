import { useQuery, useMutation, useQueryClient } from "react-query";
import { httpClient } from "../services/axios";

export const useCountStock = () => {
  const getCountStock = async () => {
    return await httpClient.get('/countstock');
  };
  return useQuery(
    "CountStock",
    () => getCountStock(),
    {
      enabled: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      //staleTime: 30000, // not to refresh the data from API is 30 seconds
    }
  );
};


export const useCreateCountStock = () => {

  const queryClient = useQueryClient();

  const createCountStock = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");

      return await httpClient.post("/create_countstock", data);
  };

  return useMutation<any, any, any>(
    "CreateCountStock",
    (params) => createCountStock(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('CountStock');
       

      },
      onError: (error) => {

        console.log(error);

      },
    }
  );
};

export const useUpdateCountStock = () => {

  const queryClient = useQueryClient();

  const updateCountStock = async (params: any): Promise<any> => {
    
    let data:any = new FormData();
      data.append('data1',JSON.stringify(params.data) || "");
      data.append('data2',JSON.stringify(params.data2) || "");
      data.append('data3',JSON.stringify(params.data3) || "");

    return await httpClient.post("/update_countstock", data);
  };

  return useMutation<any, any, any>(
    "UpdateCountStock",
    (params) => updateCountStock(params),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('CountStock');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useDeleteCountStock = () => {

  const queryClient = useQueryClient();

  const deleteCountStock = async (CountStock_ID: any): Promise<any> => {
    
    
    let data = new FormData();

    data.append('CountStock_ID', CountStock_ID || "");

    return await httpClient.post("/delete_countstock", data);
  };

  return useMutation<any, any, any>(
    "DeleteCountStock",
    (CountStock_ID) => deleteCountStock(CountStock_ID),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('CountStock');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};



export const useCountStockItem = () => {
  const queryClient = useQueryClient();

  const CountStockItem = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('CountStock_ID', params || "");
    

    return await httpClient.post("/countstock_item", data);
  };

  return useMutation<any, any, any>(
    "CountStockItem",
    (params) => CountStockItem(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('CountStock');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useCountStockNo = () => {
  const getCountStockNo = async (params: any) => {
    return await httpClient.get('/countstock_no');
  };

  return useMutation<any, any, any>(
    "getCountStockNo",
    (params) => getCountStockNo(params),
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

export const useCountStockSnap = () => {
  const queryClient = useQueryClient();

  const CountStockSnap = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Filter', params || "");
    

    return await httpClient.post("/snap_countstock", data);
  };

  return useMutation<any, any, any>(
    "CountStockSnap",
    (params) => CountStockSnap(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('CountStock');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useCountStockStatus = () => {
  const queryClient = useQueryClient();

  const CountStockStatus = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('CountStock_ID', params || "");
    

    return await httpClient.post("/countstock_status", data);
  };

  return useMutation<any, any, any>(
    "CountStockStatus",
    (params) => CountStockStatus(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('CountStock');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};