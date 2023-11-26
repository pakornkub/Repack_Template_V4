import React, { useEffect, useState } from "react";
import {
  Space,
  Button,
  message,
  Drawer,
  Form,
  Row,
  Col,
  Input,
  Select,
} from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

import { useGroup } from "../../hooks/useGroup";
import { useCreateUser, useUpdateUser } from "../../hooks/useUser";

const FormUser: React.FC<any> = ({ visible, handleCloseDrawer, user }) => {
  const { Option } = Select;

  const [formUser] = Form.useForm();

  const [requiredConfirmPassword, setRequiredConfirmPassword] =
    useState<Boolean>(false);

  const {
    isLoading: groupsIsLoading,
    isFetching,
    isError,
    data: groups,
    status,
    error,
  } = useGroup();

  const {
    isLoading: createIsLoading,
    isError: createIsError,
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateUser();

  const {
    isLoading: updateIsLoading,
    isError: updateIsError,
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateUser();

  const handleSubmit = (value: any) => {
    if (value?.User_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };

  const handlePassword = (e: any, event: any) => {
    if (event !== "1") return;

    if (e.target.value) {
      setRequiredConfirmPassword(true);
    } else {
      setRequiredConfirmPassword(false);
    }
  };

  useEffect(() => {
    formUser.resetFields();

    formUser.setFieldsValue({
      User_Index: user?.User_Index || null,
      Id: user?.Id || "",
      UserName: user?.UserName || "",
      Title: user?.Title || "Mr.",
      FirstName: user?.FirstName || "",
      LastName: user?.LastName || "",
      Email: user?.Email || "",
      IsUse: user?.event === "0" ? "1" : String(user?.IsUse),
      Group_Index: user?.Group_Index || null,
    });
  }, [user]);

  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add User Success");
      formUser.resetFields();
    } else if (createStatus === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update User Success");
    } else if (updateStatus === "error") {
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);

  const prefixFirstName = (
    <Form.Item name="Title" noStyle>
      <Select>
        <Option value="Mr.">Mr.</Option>
        <Option value="Mrs.">Mrs.</Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      <Drawer
        title="Create User"
        placement="right"
        onClose={handleCloseDrawer}
        visible={visible}
        size={"large"}
        getContainer={false}
      >
        <Form
          layout="vertical"
          form={formUser}
          name="formUser"
          onFinish={handleSubmit}
        >
          <Form.Item name="User_Index" label="User_Index" hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Id"
                label="Id"
                rules={[{ required: true, message: "Please enter user id" }]}
              >
                <Input placeholder="Please enter user id" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="UserName"
                label="Username"
                rules={[{ required: true, message: "Please enter username" }]}
              >
                <Input placeholder="Please enter username" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Password"
                label="Password"
                rules={[
                  {
                    required: user?.event === "1" ? false : true,
                    message: "Please enter password",
                  },
                ]}
              >
                <Input.Password
                  visibilityToggle={false}
                  placeholder="Please enter password"
                  onChange={(e) => handlePassword(e, user?.event)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="ConfirmPassword"
                label="Confirm Password"
                dependencies={["Password"]}
                hasFeedback
                rules={[
                  {
                    required:
                      user?.event === "1"
                        ? (requiredConfirmPassword as boolean)
                        : true,
                    message: "Please confirm password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("Password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  visibilityToggle={false}
                  placeholder="Please confirm password"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="FirstName"
                label="First Name"
                rules={[{ message: "Please enter first name" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Please enter first name"
                  addonBefore={prefixFirstName}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="LastName"
                label="Last Name"
                rules={[{ message: "Please enter last name" }]}
              >
                <Input placeholder="Please enter last name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Email"
                label="Email"
                rules={[{ message: "Please enter email" }]}
              >
                <Input type="email" placeholder="Please enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="IsUse"
                label="IsUse"
                rules={[{ required: true, message: "Please choose IsUse" }]}
              >
                <Select placeholder="Please choose IsUse">
                  <Option value="0">Inactive</Option>
                  <Option value="1">Active</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Group_Index"
                label="Group"
                rules={[{ required: false, message: "Please choose group" }]}
              >
                <Select
                  loading={groupsIsLoading}
                  showSearch
                  placeholder={`Please choose group`}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {groups?.data.data
                    .filter((value: any) => {
                      return value.IsUse === 1;
                    })
                    .map((value: any) => {
                      return (
                        <Option
                          key={value.Group_Index}
                          value={value.Group_Index}
                        >
                          {value.Name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SaveOutlined className="relative bottom-[0.2em]" />}
              >
                Submit
              </Button>
              <Button
                type="ghost"
                danger
                onClick={handleCloseDrawer}
                icon={<CloseOutlined className="relative bottom-[0.2em]" />}
              >
                Cancel
              </Button>
            </Space>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default FormUser;
