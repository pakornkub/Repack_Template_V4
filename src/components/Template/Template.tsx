import React, { useState, useEffect, useCallback } from "react";
import {
  useNavigate,
  Link,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Image } from "antd";
import * as AntdIcons from "@ant-design/icons";
import { CollapseType } from "antd/lib/layout/Sider";

import logo from "../../assets/toto-logo-banner.png";

import DynamicMenu from "../DynamicMenu";
import UserProfile from "../UserProfile";
import Error404 from "../../pages/Error404";

import "./Template.css";
import imgLogo from "../../assets/toto-logo-banner.png";

const Template: React.FC<any> = ({ children, listSubMenu, mainMenuId }) => {
  const { Header, Content, Footer, Sider } = Layout;
  const { SubMenu } = Menu;

  const navigate = useNavigate();
  const url = useParams();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [openKey, setOpenKey] = useState<string[]>([]);
  const [bread, setBread] = useState<string[]>([]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const setDefaultRouteMenu = () => {
    /* if (url["*"] === "") {
      setOpenKey([""]);
      setBread(["Dashboard"]);
    } else { */

    let defaultUrl = "";

    if (url["*"]) {
      defaultUrl = url["*"];
    } else {
      defaultUrl = getDefaultFirstMenu().MenuId;
    }

    const urlMenu = listSubMenu.filter(
      (value: any) => value.MenuId === defaultUrl
    );

    const arrayRoute = urlMenu[0]?.Route.split(".").filter(
      (value: any) => parseInt(value) !== 0
    );

    let arrayKey: string[] = [];
    let arrayBread: string[] = [];

    arrayRoute?.forEach((element: any) => {
      const menu = listSubMenu.filter(
        (value: any) => value.Menu_Index === parseInt(element)
      );

      if (menu[0].MenuTypeId !== "PRM" && menu[0].MenuTypeId !== "PUM") {
        arrayKey.push(menu[0].MenuId);
        arrayBread.push(menu[0].MenuName);
      }
    });

    setOpenKey(arrayKey);
    setBread(arrayBread);

    /*  } */
  };

  const getDefaultFirstMenu = useCallback(() => {
    return listSubMenu
      .filter(
        (value: any) =>
          value.MenuTypeId !== "PRM" &&
          value.MenuTypeId !== "PUM" &&
          value.MenuTypeId !== "PRSC" &&
          value.MenuTypeId !== "PUSC"
      )
      ?.sort((a: any, b: any) => a.Seq - b.Seq)[0];
  }, [listSubMenu]);

  useEffect(() => {
    setDefaultRouteMenu();
  }, [url]);

  const recursiveMenu: any = useCallback(
    (currentMenu: any, posRoute: any) => {
      const menu = listSubMenu.filter(
        (value: any) =>
          parseInt(value.Route.split(".")[posRoute]) ===
            currentMenu.Menu_Index &&
          parseInt(value.Route.split(".")[posRoute + 1]) !== 0 &&
          (parseInt(value.Route.split(".")[posRoute + 2]) === 0 ||
            typeof value.Route.split(".")[posRoute + 2] === "undefined")
      );

      if (menu.length > 0) {
        return menu.map((value: any) => {
          if (value.MenuTypeId === "PRS" || value.MenuTypeId === "PUS") {
            return (
              <Menu.Item key={value.MenuId}>
                {value.MenuName}
                <Link
                  to={`${import.meta.env.VITE_APP_PUBLIC_URL}${
                    `/${mainMenuId}${value?.Part}` || `/${mainMenuId}/Blank`
                  }`}
                />
              </Menu.Item>
            );
          } else {
            return (
              <SubMenu key={value.MenuId} title={value.MenuName}>
                {recursiveMenu(value, posRoute + 1)}
              </SubMenu>
            );
          }
        });
      }
    },
    [listSubMenu, mainMenuId]
  );

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onBreakpoint={(broken: boolean) => {
            if (!broken) {
              setCollapsed(false);
            }
          }}
          onCollapse={(collapsed: boolean, type: CollapseType) => {
            if (collapsed) {
              setCollapsed(true);
            }
          }}
        >
          {/* <div
            className="logo-template cursor-pointer"
            onClick={() => navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`)}
          /> */}
          <div className="logo-template cursor-pointer">
            <Image
              src={logo}
              preview={false}
              style={{ width: 120 }}
              onClick={() => navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`)}
            />
          </div>

          <Menu
            theme="dark"
            defaultSelectedKeys={[
              url["*"] ? url["*"] : (getDefaultFirstMenu().MenuId as any),
            ]}
            defaultOpenKeys={openKey}
            openKeys={openKey}
            onOpenChange={(openKeys) => {
              setOpenKey(openKeys);
            }}
            mode="inline"
          >
            {listSubMenu
              ?.filter(
                (value: any) => parseInt(value.Route.split(".")[2]) === 0
              )
              ?.sort((a: any, b: any) => a.Seq - b.Seq)
              ?.map((value: any) => {
                const AntdIcon: any =
                  AntdIcons[
                    (value?.Icon as keyof typeof AntdIcons) ||
                      "ExclamationCircleOutlined"
                  ];

                /*  if (value.MenuTypeId === "PRM" || value.MenuTypeId === "PUM") {
                  return (
                    <Menu.Item key={""} icon={<AntdIcon />}>
                      {"Dashboard"}
                      <Link
                        to={`${import.meta.env.VITE_APP_PUBLIC_URL}${value.Part}`}
                      />
                    </Menu.Item>
                  );
                } else */ if (
                  value.MenuTypeId === "PRS" ||
                  value.MenuTypeId === "PUS"
                ) {
                  return (
                    <Menu.Item key={value.MenuId} icon={<AntdIcon />}>
                      {value.MenuName}
                      <Link
                        to={`${import.meta.env.VITE_APP_PUBLIC_URL}${
                          `/${mainMenuId}${value?.Part}` ||
                          `/${mainMenuId}/Blank`
                        }`}
                      />
                    </Menu.Item>
                  );
                } else if (
                  value.MenuTypeId === "PRSC" ||
                  value.MenuTypeId === "PUSC"
                ) {
                  return (
                    <SubMenu
                      key={value.MenuId}
                      title={value.MenuName}
                      icon={<AntdIcon />}
                      className="active"
                    >
                      {recursiveMenu(value, 1)}
                    </SubMenu>
                  );
                }
              })}
          </Menu>
        </Sider>
        <Layout className="site-layout-template">
          <Header
            className="site-layout-background-template"
            style={{ padding: 0 }}
          >
            <Row className="min-w-[300px]">
              <Col flex={1}>
                {React.createElement(
                  collapsed
                    ? AntdIcons.MenuUnfoldOutlined
                    : AntdIcons.MenuFoldOutlined,
                  {
                    className: "trigger-template",
                    onClick: handleCollapse,
                  }
                )}
              </Col>
              <Col flex={1} className="flex justify-end items-center pr-3">
                <UserProfile mode="main" />
              </Col>
            </Row>
          </Header>
          <Content className="m-[0px_16px]">
            <Breadcrumb style={{ margin: "16px 0" }}>
              {bread.map((value: any, index: number) => (
                <Breadcrumb.Item className="text-[20px] font-bold" key={index}>{value}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
            <div className="site-layout-background-template p-6 min-h-[100vh]">
              <Routes>
                {/* <Route path="/" element={children} /> */}
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={`${import.meta.env.VITE_APP_PUBLIC_URL}/${mainMenuId}/${
                        getDefaultFirstMenu().MenuId
                      }`}
                      replace
                    />
                  }
                />
                {listSubMenu
                  ?.filter(
                    (value: any) =>
                      value.Part &&
                      (value.MenuTypeId === "PRS" || value.MenuTypeId === "PUS")
                  )
                  .map((value: any, key: number) => {
                    return (
                      <Route
                        key={key}
                        path={value.Part}
                        element={
                          <DynamicMenu
                            MenuId={value.MenuId}
                            Menu_Index={value.Menu_Index}
                          />
                        }
                      />
                    );
                  })}
                <Route path={`/*`} element={<Error404 />} />
              </Routes>
            </div>
          </Content>
          <Footer className="text-center">
            TOTO REPACK ©2022 Develop by PK Solution
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Template;
