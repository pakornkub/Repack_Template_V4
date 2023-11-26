import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Dropdown,
  Button,
  Menu as AntdMenu,
  Row,
  Col,
  Input,
  Modal,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { useMenu, useDeleteMenu } from "../../hooks/useMenu";
import FormMenu from "./FormMenu";

const Menu: React.FC<any> = () => {
  const [visible, setVisible] = useState(false);
  const [menu, setMenu] = useState<any>({});
  const [menuSearch, setMenuSearch] = useState<any>([]);

  const {
    isLoading,
    isFetching,
    data: menus,
  } = useMenu();

  const { mutate: deleteMutate } = useDeleteMenu();

  const handleShowDrawer = () => {
    setVisible(true);
  };

  const handleCloseDrawer = () => {
    setVisible(false);
  };

  const handleAddMenu = () => {
    handleShowDrawer();
    setMenu({ event: "0" });
  };

  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        handleShowDrawer();
        setMenu({ ...record, event: e.key });

        break;
      case "2":
        if (
          menus?.data?.data.filter(
            (value: any) =>
              parseInt(value.ParentMenu_Index) === parseInt(record.Menu_Index)
          ).length > 0
        ) {
          Modal.error({
            title: "Can't Delete",
            content: `There is some menu that under this menu : ${record.Name}`,
          });
        } else {
          Modal.confirm({
            title: "Delete Confirm",
            content: <>{`Do you want delete menu : ${record.Name} ?`}</>,
            onOk: () => {
              deleteMutate({Menu_Index : record.Menu_Index,Id :record.Id});
            },
          });
        }

        break;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const userDataSearch = menus?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setMenuSearch(userDataSearch);
    } else {
      setMenuSearch(menus?.data.data || []);
    }
  };

  useEffect(() => {
    setMenuSearch(menus?.data.data || []);
  }, [isFetching]);

  const actionMenu = (record: any) => (
    <AntdMenu
      onClick={(e) => {
        handleMenu(e, record);
      }}
    >
      <AntdMenu.Item key="1" icon={<EditOutlined />}>
        Detail
      </AntdMenu.Item>
      <AntdMenu.Item key="2" danger icon={<DeleteOutlined />}>
        Delete
      </AntdMenu.Item>
    </AntdMenu>
  );

  const columns = [
    {
      title: "",
      key: "Action",
      className: "w-10",
      render: (text: any, record: any, index: any) => {
        return (
          <Dropdown trigger={["click"]} overlay={actionMenu(record)}>
            <Button>
              Action <DownOutlined />
            </Button>
          </Dropdown>
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
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      align: "center",
      sorter: (a: any, b: any) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Description",
      dataIndex: "Des",
      key: "Description",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Des.localeCompare(b.Des),
    },
    {
      title: "Platform",
      dataIndex: "PlatformName",
      key: "PlatformName",
      align: "center",
      sorter: (a: any, b: any) => a.PlatformName.localeCompare(b.PlatformName),
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
              onClick={handleAddMenu}
            >
              Add
            </Button>
          </Col>
          <Col className="flex justify-end items-center" flex={1}>
            <Input
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              placeholder="Search"
              onChange={(e) => handleSearch(e)}
            />
          </Col>
        </Row>
        <Table
          rowKey={(record: any) => record.Menu_Index}
          bordered
          size="small"
          loading={isLoading}
          columns={columns as any}
          dataSource={menuSearch}
        />
      </Space>
      {
        <FormMenu
          visible={visible}
          handleCloseDrawer={handleCloseDrawer}
          menu={menu}
        />
      }
    </>
  );
};

export default Menu;
