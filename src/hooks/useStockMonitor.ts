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



export const useStockGroup = () => {
  const queryClient = useQueryClient();

  const StockGroup = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Filter', params || "");
    

    return await httpClient.post("/stockmonitorgroup", data);
  };

  return useMutation<any, any, any>(
    "StockGroup",
    (params) => StockGroup(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('StockMonitor');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};


export const useStockDetail = () => {
  const queryClient = useQueryClient();

  const StockDetail = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Filter', params || "");
    

    return await httpClient.post("/stockmonitordetail", data);
  };

  return useMutation<any, any, any>(
    "StockDetail",
    (params) => StockDetail(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('StockMonitor');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useStockWH = () => {
  const queryClient = useQueryClient();

  const StockWH = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Filter', params || "");
    

    return await httpClient.post("/stockmonitorwh", data);
  };

  return useMutation<any, any, any>(
    "StockWH",
    (params) => StockWH(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('StockMonitor');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};

export const useStockWHHeader = () => {
  const queryClient = useQueryClient();

  const StockWH = async (params: any): Promise<any> => {
    let data = new FormData();

    data.append('Filter', params || "");
    

    return await httpClient.post("/stockmonitorwh_header  ", data);
  };

  return useMutation<any, any, any>(
    "StockWHheader",
    (params) => StockWH(params),
    {
      onSuccess: (response) => {

        queryClient.invalidateQueries('StockMonitor');

      },
      onError: (error) => {

        console.log(error?.response?.data?.message || error.message);

      },
    }
  );
};