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
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { useGroup, useDeleteGroup } from "../../hooks/useGroup";
import FormGroup from "./FormGroup";

const Group: React.FC<any> = () => {
  const [visible, setVisible] = useState(false);
  const [group, setGroup] = useState<any>({});
  const [groupSearch, setGroupSearch] = useState<any>([]);

  const {
    isLoading,
    isFetching,
    data: groups,
  } = useGroup();

  const { mutate: deleteMutate } = useDeleteGroup();

  const handleShowDrawer = () => {
    setVisible(true);
  };

  const handleCloseDrawer = () => {
    setVisible(false);
  };

  const handleAddGroup = () => {
    handleShowDrawer();
    setGroup({ event: "0" });
  };

  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        handleShowDrawer();
        setGroup({ ...record, event: e.key });

        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: <>{`Do you want delete group data : ${record.Name} ?`}</>,
          onOk: () => {
            deleteMutate(record.Group_Index);
          },
        });

        break;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const userDataSearch = groups?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setGroupSearch(userDataSearch);
    } else {
      setGroupSearch(groups?.data.data || []);
    }
  };

  useEffect(() => {
    setGroupSearch(groups?.data.data || []);
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
              onClick={handleAddGroup}
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
          rowKey={(record: any) => record.Group_Index}
          bordered
          size="small"
          loading={isLoading}
          columns={columns as any}
          dataSource={groupSearch}
        />
      </Space>
      {<FormGroup
        visible={visible}
        handleCloseDrawer={handleCloseDrawer}
        group={group}
      />}
    </>
  );
};

export default Group;
