import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import jwt_decode from "jwt-decode";

import { useRefreshToken } from "../../hooks/useLogin";
import { setAuth, selectAuth } from "../../contexts/slices/authSlice";
import { getCurrentTimeStamp } from "../../utils/date";
import { expireTime, refreshTime, idleTime, confirmTime } from "../../configs/token";

const getTimeFromToken = (token: string): number => {
  const { time }: any = token ? jwt_decode(token) : 0;
  return time;
};

const IdleTimerContainer: React.FC<any> = ({ children }) => {

  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const { authResult } = useSelector(selectAuth);

  const { status, error, mutate } = useRefreshToken(); 

  const sessionTimeOutRef = useRef<any>(null); 

  const showActiveConfirm = () => {
    Modal.confirm({
      title: `You have been idle for while !`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          {"Would you like to stay signed in ?"}
          <br />
          {"(You will be signed out in 5 minutes)"}
        </>
      ),
      onOk() {
        reset(); // reset timer
      },
      onCancel() {
        Modal.destroyAll(); // destroy modal
        dispatch(setAuth({})); // sign out
        navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`); // redirect to login page
      },
      okText: "Stay Signed In",
      cancelText: "Sign Out",
    });
  };

  const handleOnIdle = async (e: any) => {
    // console.log("user is idle", e);
    // console.log("last active", getLastActiveTime());

    await showActiveConfirm(); // show modal

    sessionTimeOutRef.current = setTimeout(() => {
      Modal.destroyAll(); // destroy modal
      dispatch(setAuth({})); // sign out
      navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`); // redirect to login page
    }, confirmTime); // 5 minutes

  };

  const handleOnActive = (e: any) => {
    // console.log("user is active", e);
    // console.log("time remaining", getRemainingTime());

    clearTimeout(sessionTimeOutRef.current);  // clear timeout
    mutate(); // refresh token
  };

  const handleOnAction = (e: any) => {
    //console.log('user did something', e)

    const accessTime = getTimeFromToken(authResult?.data?.token);
    const currentTime = getCurrentTimeStamp();

    if (currentTime - accessTime > expireTime) {
      pause(); // pause the timer
      Modal.error({
        title: 'Your session has expired !',
        content: 'Please sign in again',
      });
      dispatch(setAuth({})); // sign out
      navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`); // redirect to login page
    }

    const refreshToken = currentTime - accessTime > refreshTime; // check refresh token if currentTime - accessTime > refreshTime 

    if (refreshToken) {
      mutate(); // refresh token
    }
  };

  const { getRemainingTime, getLastActiveTime, reset, pause } = useIdleTimer({
    timeout: idleTime,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 250, // wait 250ms before calling onAction
    stopOnIdle: true, // stop the timer when the user becomes idle
  });

  useEffect(() => {
    if (status === "error") {
      message.error(error?.response?.data?.message || error.message);
      dispatch(setAuth({}));
    }
  }, [status]); //!

  return <>{children}</>;
};

export default IdleTimerContainer;
