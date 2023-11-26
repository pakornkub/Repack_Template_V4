import React, { useState } from "react";
import { useNavigate,Routes, Route, useParams } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Row, Col, Image } from "antd";
import logo from "../../assets/toto-logo-banner.png";
import DynamicMenu from "../DynamicMenu";
import UserProfile from "../UserProfile";
import Error404 from "../../pages/Error404";

import "./Template2.css";

const Template: React.FC<any> = ({ children, listSubMenu, mainMenuId }) => {
  const { Header, Content, Footer } = Layout;

  const navigate = useNavigate();
  const url = useParams();
  const [bread, setBread] = useState<string[]>([]);

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout-template">
          <Header className="header-main1" style={{ padding: "0px" }}>
            <Row className="min-w-[300px]">
              <Col>
                <div className="logo-template cursor-pointer">
                  <Image
                    src={logo}
                    preview={false}
                    style={{ width: 150 }}
                    onClick={() =>
                      navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`)
                    }
                  />
                </div>
              </Col>
              <Col flex={1} className="flex justify-end items-center pr-3">
                <UserProfile mode="light" />
              </Col>
            </Row>
          </Header>
          <Content className="m-[0px_16px]">
            <Breadcrumb className="text-[20px] font-bold" style={{ margin: "16px 0",color: 'rgba(0,0,0,.85)' }}>
              {bread.map((value: any, index: number) => (
                <Breadcrumb.Item className="text-[20px] font-bold" key={index}>{value}</Breadcrumb.Item>
              ))}
              {listSubMenu[0].MenuName}
            </Breadcrumb>
            <div className="site-layout-background-template p-6 min-h-[100vh]">
              <Routes>
                <Route path="/" element={children} />
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
          <Footer className="text-center">TOTO THAILAND</Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default Template;
