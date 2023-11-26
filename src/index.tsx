import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from "./reportWebVitals";
import { store } from "./contexts/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import './index.css'

const queryClient = new QueryClient();
//mai
ReactDOM.render(
  //<React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  //</React.StrictMode>
  ,document.getElementById("root")
);

reportWebVitals();
