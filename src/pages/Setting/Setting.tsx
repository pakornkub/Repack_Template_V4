import React from "react";
import { useSelector } from "react-redux";

import { selectAuth } from "../../contexts/slices/authSlice";

import Template from "../../components/Template/";

import "./Setting.css";

const Setting: React.FC<any> = ({MenuId,Menu_Index}) => {
  
  const { authResult } = useSelector(selectAuth);

  return <Template mainMenuId={MenuId} listSubMenu={authResult.data.permission.filter((value: any) => parseInt(value.Route.split('.')[0]) === Menu_Index)}></Template>;
};

export default Setting;
