import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout, Row, Col, Typography, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { selectAuth } from "../../contexts/slices/authSlice";

import UserProfile from "../../components/UserProfile";
import LogoMain from "../../components/LogoMain";

import "./Main.css";

const Main: React.FC = () => {
  console.log('TEST');
  const { Header, Content } = Layout;
  const { Text } = Typography;

  const navigate = useNavigate();

  const { authResult } = useSelector(selectAuth);

  const [menuMain, setMenuMain] = useState<String[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const menuMainSearch = authResult.data.permission.filter((value: any) => {
        return value.MenuName.toLowerCase().includes(
          e.target.value.toLowerCase()
        );
      });

      setMenuMain(menuMainSearch);
    } else {
      setMenuMain(authResult.data.permission);
    }
  };

  useEffect(() => {
    setMenuMain(authResult.data.permission);
  }, [authResult]);

  return (
    <>
      <div className="bg-pk-template bg-main">
        <Header className="header-pk-template header-main">
          <Row className="min-w-[300px]">
            <Col flex={1}>
              <LogoMain />
              <Input
                /*style={{
                  color: "white",
                  backgroundColor: "rgba(1,21,41,0.5)",
                  borderRadius: 100,
                }}*/
                className="search-main hidden"
                size="large"
                prefix={<SearchOutlined />}
                placeholder={`  Search`}
                bordered={false}
                allowClear
                onChange={handleSearch}
              />
            </Col>
            <Col flex={1} className="flex justify-end items-center">
              <UserProfile mode="main" />
            </Col>
          </Row>
        </Header>
        <Content className="p-12 mt-12">
          <Row>
            {menuMain
              ?.filter(
                (value: any) =>
                  value.MenuTypeId.includes("PRM") ||
                  value.MenuTypeId.includes("PUM")
              )
              ?.sort((a: any, b: any) => a.Seq - b.Seq)
              ?.map((value: any, index: any) => (
                <Col
                  key={index}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={6}
                  xxl={6}
                  className="menu-main"
                  onClick={() =>
                    navigate(
                      `${import.meta.env.VITE_APP_PUBLIC_URL}${
                        value?.Part || "/Blank"
                      }`
                    )
                  }
                >
                  <div
                    className="menu-main-sub"
                    style={{
                      backgroundImage: `url('${import.meta.env.VITE_APP_API_URL}/uploads/${value?.Picture}')`,
                    }}
                  >
                    <Text className="menu-main-sub-title">
                      {value.MenuName}
                    </Text>
                  </div>
                  
                </Col>
              ))}
          </Row>
          <Row>
          </Row>
        </Content>
      </div>
    </>
  );
};

export default Main;
