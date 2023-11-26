import { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "./contexts/slices/authSlice";
import DynamicMenu from "./components/DynamicMenu";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Main from "./pages/Main";
import QrCodePrint from "./pages/ReceivePart/QrCodePrint";
import QrCodePrintAll from "./pages/ReceivePart/QrCodePrintAll";
import QrBoxPrintAll from "./pages/JobRepack/QrBoxPrintAll";
import QrCodePrintMisc from "./pages/Grade/QrCodePrintMisc";
import Error404 from "./pages/Error404";
import './App.css'

function App() {
  document.title = import.meta.env.VITE_APP_NAME as string;
  console.log(import.meta.env.VITE_APP_NAME);

  const { authResult } = useSelector(selectAuth);

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <Navigate to={`${import.meta.env.VITE_APP_PUBLIC_URL}/`} replace />
          }
        />
        <Route
          //index
          path={`${import.meta.env.VITE_APP_PUBLIC_URL}/`}
          element={
            authResult?.status ? (
              <Navigate
                to={`${import.meta.env.VITE_APP_PUBLIC_URL}/Main`}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path={`${import.meta.env.VITE_APP_PUBLIC_URL}/Main`}
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
       
        <Route path={`${import.meta.env.VITE_APP_PUBLIC_URL}/QrCodePrint`} element={<QrCodePrint/>} />
        <Route path={`${import.meta.env.VITE_APP_PUBLIC_URL}/QrCodePrintAll`} element={<QrCodePrintAll/>} /> 
        <Route path={`${import.meta.env.VITE_APP_PUBLIC_URL}/QrBoxPrintAll`} element={<QrBoxPrintAll/>} />
        <Route path={`${import.meta.env.VITE_APP_PUBLIC_URL}/QrCodePrintMisc`} element={<QrCodePrintMisc/>} /> 

        {authResult?.data?.permission
          ?.filter(
            (value: any) =>
              value.Part &&
              (value.MenuTypeId.includes("PRM") ||
                value.MenuTypeId.includes("PUM"))
          )
          ?.map((value: any, index: any) => (
            <Route
              key={index}
              path={`${import.meta.env.VITE_APP_PUBLIC_URL}${value.Part}${
                value.IsParent ? "/*" : ""
              }`}
              element={
                <ProtectedRoute>
                  <DynamicMenu
                    MenuId={value.MenuId}
                    Menu_Index={value.Menu_Index}
                  />
                </ProtectedRoute>
              }
            />
          ))}
          
        <Route path={`/*`} element={<Error404 />} />
        <Route
          path={`${import.meta.env.VITE_APP_PUBLIC_URL}/*`}
          element={<Error404 />}
        />
      </Routes>
    </>
  )
}

export default App
