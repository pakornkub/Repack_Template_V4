import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Dropdown,
  Button,
  Menu,
  Row,
  Col,
  Input,
  Modal,
  Tooltip,
} from "antd";
import {
  DownOutlined,
  FundViewOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { useUser, useDeleteUser } from "../../hooks/useUser";
import FormUser from "./FormUser";

const User: React.FC<any> = () => {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<any>({});
  const [userSearch, setUserSearch] = useState<any>([]);

  const {
    isLoading,
    isFetching,
    isError,
    data: users,
    status,
    error,
  } = useUser();


  const { mutate: deleteMutate } = useDeleteUser();

  const handleShowDrawer = () => {
    setVisible(true);
  };

  const handleCloseDrawer = () => {
    setVisible(false);
  };

  const handleAddUser = () => {
    handleShowDrawer();
    setUser({ event: "0" });
  };

  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        handleShowDrawer();
        setUser({ ...record, event: e.key });
        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: <>{`Do you want delete user data : ${record.UserName} ?`}</>,
          onOk: () => {
            deleteMutate(record.User_Index);
          },
        });

        break;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const userDataSearch = users?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setUserSearch(userDataSearch);
    } else {
      setUserSearch(users?.data.data || []);
    }
  };

  useEffect(() => {
    setUserSearch(users?.data.data || []);
  }, [isFetching]);

  const menu = (record: any) => (
    <Menu
      onClick={(e) => {
        handleMenu(e, record);
      }}
    >
      <Menu.Item key="1" icon={<EditOutlined />}>
        Detail
      </Menu.Item>
      <Menu.Item key="2" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "",
      key: "Action",
      className: "w-10",
      render: (text: any, record: any, index: any) => {
        return (
           <Dropdown trigger={["click"]} overlay={menu(record)}>
            <Button>
              Action <DownOutlined />
            </Button>
          </Dropdown>
          /* <>
            <Space>
              <Tooltip title="Detail">
                <Button
                  type="primary"
                  shape="circle"
                  className="opacity-80"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    handleMenu({key:"1"}, record);
                  }}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  className="opacity-80"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleMenu({key:"2"}, record);
                  }}
                />
              </Tooltip>
            </Space>
          </> */
        );
      },
    },
    {
      title: "Id",
      dataIndex: "Id",
      key: "Id",
      align: "center",
      sorter: (a: any, b: any) => a.Id.localeCompare(b.Id),
    },
    {
      title: "Username",
      dataIndex: "UserName",
      key: "UserName",
      align: "center",
      sorter: (a: any, b: any) => a.UserName.localeCompare(b.UserName),
    },
    {
      title: "FullName",
      dataIndex: "FullName",
      key: "FullName",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.FullName.localeCompare(b.FullName),
      /* render: (text: any, record: any, index: any) =>
        `${record.Title} ${record.FirstName} ${record.LastName}`, */
    },
    {
      title: "Group",
      dataIndex: "GroupID",
      key: "GroupID",
      align: "center",
      sorter: (a: any, b: any) => a.GroupID.localeCompare(b.GroupID),
    },
    {
      title: "Active",
      dataIndex: "IsUse",
      key: "IsUse",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.IsUse - b.IsUse,
      render: (text: any, record: any, index: any) => {
        return (
          <Tag color={text ? "success" : "error"}>
            {text ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Create By",
      dataIndex: "AddBy",
      key: "AddBy",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.AddBy.localeCompare(b.AddBy),
    },
    {
      title: "Create Date",
      dataIndex: "AddDate",
      key: "AddDate",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        moment(a.AddDate).unix() - moment(b.AddDate).unix(),
    },
  ];

  return (
    <>
      <Space className="w-[100%]" direction="vertical">
        <Row>
          <Col flex={1}>
            <Button
              type="primary"
              className="btn-success"
              icon={<PlusOutlined className="relative bottom-[0.2em]" />}
              onClick={handleAddUser}
            >
              Add
            </Button>
          </Col>
          <Col className="flex justify-end items-center" flex={1}>
            <Input
              className="w-[300px]"
              prefix={<SearchOutlined />}
              placeholder="Search"
              onChange={(e) => handleSearch(e)}
            />
          </Col>
        </Row>
        <Table
          rowKey={(record: any) => record.User_Index}
          bordered
          size="small"
          loading={isLoading}
          columns={columns as any}
          dataSource={userSearch}
        />
      </Space>
      <FormUser
        visible={visible}
        handleCloseDrawer={handleCloseDrawer}
        user={user}
      />
    </>
  );
};

export default User;
