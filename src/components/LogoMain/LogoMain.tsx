import React from "react";
import { Space, Divider, Typography } from "antd";
import { CodeSandboxOutlined,DropboxOutlined } from "@ant-design/icons";

const LogoMain = () => {
  const { Title } = Typography;
  return (
    <>
      <Space direction="horizontal">
        <DropboxOutlined className="text-blue-500 text-4xl" />
        <Space size={2} direction="horizontal">
          <Title level={3} className="text-black mt-3">
            TOTO REPACK
          </Title>
          <Divider type="vertical" className="bg-gray-500 h-5 w-[2px] " />
          <Title level={4} className="text-gray-500 mt-[11px]">
            SYSTEM
          </Title>
        </Space>
      </Space>
    </>
  );
};

export default LogoMain;
