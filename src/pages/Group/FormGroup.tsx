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

import { useCreateGroup, useUpdateGroup } from "../../hooks/useGroup";

const FormGroup: React.FC<any> = ({ visible, handleCloseDrawer, group }) => {
  const { Option } = Select;

  const [formGroup] = Form.useForm();

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateGroup();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateGroup();

  const handleSubmit = (value: any) => {
    if (value?.Group_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };

  useEffect(() => {
    formGroup.resetFields();

    formGroup.setFieldsValue({
      Group_Index: group?.Group_Index || null,
      Id: group?.Id || "",
      Name: group?.Name || "",
      Des: group?.Des || "",
      IsUse: group?.event === "0" ? '1' : String(group?.IsUse),
    });
  }, [group]);

  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Group Success");
      formGroup.resetFields();
    } else if (createStatus === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Group Success");
    } else if (updateStatus === "error") {
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);

  return (
    <>
      <Drawer
        title="Create Group"
        placement="right"
        onClose={handleCloseDrawer}
        visible={visible}
        size={"large"}
        getContainer={false}
      >
        <Form
          layout="vertical"
          form={formGroup}
          name="formGroup"
          onFinish={handleSubmit}
        >
          <Form.Item name="Group_Index" label="Group_Index" hidden>
            <Input />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Id"
                label="Id"
                rules={[{ required: true, message: "Please enter group id" }]}
              >
                <Input placeholder="Please enter group id" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Name"
                label="Group Name"
                rules={[{message: "Please enter group name" }]}
              >
                <Input placeholder="Please enter group name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="IsUse"
                label="IsUse"
                rules={[
                  { required: true, message: "Please choose IsUse" },
                ]}
              >
                <Select placeholder="Please choose IsUse">
                  <Option value="0">Inactive</Option>
                  <Option value="1">Active</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="Des"
                label="Description"
                rules={[{ message: "Please enter description" }]}
              >
                <Input.TextArea
                  style={{ width: "100%" }}
                  placeholder="Please enter description"
                  rows={4}
                />
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

export default FormGroup;
