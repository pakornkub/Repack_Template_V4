import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Row,
  Col,
  Input,
  Checkbox,
  Form,
  message,
} from "antd";
import {
  SaveOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

import { useCreatePermission } from "../../hooks/usePermission";

const MenuPermissionList: React.FC<any> = ({
  filter,
  permissions,
  isLoadingPermission,
}) => {
  const [formMenuPermissionList] = Form.useForm();

  const [permissionList, setPermissionList] = useState<any>([]);
  const [permissionSearch, setPermissionSearch] = useState<any>([]);

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreatePermission();

  const handleSubmit = (values: any) => {
    createMutate({ filter,items: values.items });
  };

  const handleCheck = (e: any, index: number, title: string) => {
    let newPermissionSearch = [...permissionSearch];
    newPermissionSearch[index][title] = e.target.checked ? 1 : 0;

    updatePermissionList(newPermissionSearch, title);
    setPermissionSearch(newPermissionSearch);
  };

  const updatePermissionList = (values: any, title: any) => {
    let newPermissionList = [...permissionList];
    permissionList.forEach((itemList: any, index: number) => {
      values.forEach((itemSearch: any) => {
        if (itemList.MenuName === itemSearch.MenuName) {
          newPermissionList[index][title] = itemSearch[title];
        }
      });
    });

    formMenuPermissionList.setFieldsValue({ items: newPermissionList });
    setPermissionList(newPermissionList);
  };

  const updatePermissionLists = (values: any) => {
    let newPermissionList = [...permissionList];
    permissionList.forEach((itemList: any, index: number) => {
      values.forEach((itemSearch: any) => {
        if (itemList.MenuName === itemSearch.MenuName) {
          newPermissionList[index] = itemSearch;
        }
      });
    });

    formMenuPermissionList.setFieldsValue({ items: newPermissionList });
    setPermissionList(newPermissionList);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const userDataSearch = permissionList.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setPermissionSearch(userDataSearch);
    } else {
      setPermissionSearch(permissionList);
    }
  };

  const handleResets = (type: string, index: number = -1) => {
    let newPermissionSearch = [...permissionSearch];

    if (type === "All") {
      permissionSearch.forEach((itemSearch: any, index: number) => {
        Object.keys(itemSearch).forEach((key: any) => {
          if (
            key.slice(-2) === "ed" ||
            key.slice(-2) === "d1" ||
            key.slice(-2) === "d2"
          ) {
            newPermissionSearch[index][key] = 0;
          }
        });
      });
    } else {
      Object.keys(newPermissionSearch[index]).forEach((key: any) => {
        if (
          key.slice(-2) === "ed" ||
          key.slice(-2) === "d1" ||
          key.slice(-2) === "d2"
        ) {
          newPermissionSearch[index][key] = 0;
        }
      });
    }

    updatePermissionLists(newPermissionSearch);
    setPermissionSearch(newPermissionSearch);
  };

  const handleChecks = (type: string, index: number = -1) => {
    let newPermissionSearch = [...permissionSearch];

    if (type === "All") {
      permissionSearch.forEach((itemSearch: any, index: number) => {
        Object.keys(itemSearch).forEach((key: any) => {
          if (
            key.slice(-2) === "ed" ||
            key.slice(-2) === "d1" ||
            key.slice(-2) === "d2"
          ) {
            newPermissionSearch[index][key] = 1;
          }
        });
      });
    } else {
      Object.keys(newPermissionSearch[index]).forEach((key: any) => {
        if (
          key.slice(-2) === "ed" ||
          key.slice(-2) === "d1" ||
          key.slice(-2) === "d2"
        ) {
          newPermissionSearch[index][key] = 1;
        }
      });
    }

    updatePermissionLists(newPermissionSearch);
    setPermissionSearch(newPermissionSearch);
  };

  useEffect(() => {
    formMenuPermissionList.setFieldsValue({ items: permissions });
    setPermissionList(permissions);
    setPermissionSearch(permissions);
  }, [permissions]);

  useEffect(() => {
    if (createStatus === "success") {
      message.success("Create Menu Permission Success");
    } else if (createStatus === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  const columns = [
    {
      title: "MenuName",
      dataIndex: "MenuName",
      key: "MenuName",
      width: "23%",
      align: "center",
      fixed: true,
      sorter: (a: any, b: any) => a.MenuName.localeCompare(b.MenuName),
    },
    {
      title: "Created",
      key: "Created",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Created}
            onChange={(e) => handleCheck(e, index, "Created")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Readed",
      dataIndex: "Readed",
      key: "Readed",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Readed}
            onChange={(e) => handleCheck(e, index, "Readed")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Updated",
      dataIndex: "Updated",
      key: "Updated",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Updated}
            onChange={(e) => handleCheck(e, index, "Updated")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Deleted",
      dataIndex: "Deleted",
      key: "Deleted",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Deleted}
            onChange={(e) => handleCheck(e, index, "Deleted")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Exported",
      dataIndex: "Exported",
      key: "Exported",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Exported}
            onChange={(e) => handleCheck(e, index, "Exported")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Printed",
      dataIndex: "Printed",
      key: "Printed",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Printed}
            onChange={(e) => handleCheck(e, index, "Printed")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Approved1",
      dataIndex: "Approved1",
      key: "Approved1",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Approved1}
            onChange={(e) => handleCheck(e, index, "Approved1")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Approved2",
      dataIndex: "Approved2",
      key: "Approved2",
      width: "8%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <Checkbox
            checked={record.Approved2}
            onChange={(e) => handleCheck(e, index, "Approved2")}
          ></Checkbox>
        );
      },
    },
    {
      title: "Option",
      key: "Option",
      width: "13%",
      align: "center",
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <Space direction="horizontal">
              <Button
                type="primary"
                className="btn-info"
                onClick={() => handleChecks("Row", index)}
                icon={
                  <CheckSquareOutlined className="relative bottom-[0.2em]" />
                }
              >
                Check
              </Button>
              <Button
                type="ghost"
                onClick={() => handleResets("Row", index)}
                icon={<ClearOutlined className="relative bottom-[0.2em]" />}
                danger
              >
                Clear
              </Button>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Space className="w-[100%]" direction="vertical">
        <Row>
          <Col flex={1}>
            <Space direction="horizontal">
              <Button
                type="primary"
                className="btn-info"
                icon={
                  <CheckSquareOutlined className="relative bottom-[0.2em]" />
                }
                onClick={() => handleChecks("All")}
              >
                Check All
              </Button>
              <Button
                type="ghost"
                icon={<ClearOutlined className="relative bottom-[0.2em]" />}
                onClick={() => handleResets("All")}
                danger
              >
                Clear All
              </Button>
            </Space>
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
        <Form
          form={formMenuPermissionList}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item name="items">
            <Table
              rowKey={(record: any) => record.Menu_Index}
              bordered
              size="small"
              loading={isLoadingPermission}
              columns={columns as any}
              dataSource={permissionSearch}
              pagination={false}
              scroll={{ y: "calc(100vh - 300px)", x: "100%" }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              icon={<SaveOutlined className="relative bottom-[0.2em]" />}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </>
  );
};

export default MenuPermissionList;
