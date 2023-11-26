import React, { useState, useEffect } from "react";
import { Button, Radio, Form, Select, Divider } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { useUser } from "../../hooks/useUser";
import { useGroup } from "../../hooks/useGroup";
import { usePermission } from "../../hooks/usePermission";

import MenuPermissionList from "./MenuPermissionList";

import "./MenuPermission.css";

interface WindowSize {
  width: number;
  height: number;
}

const MenuPermission: React.FC<any> = () => {
  const initDefaultValue = {
    Platform: "WA",
    User_Group: "User",
  };

  const [formMenuPermission] = Form.useForm();
  const { Option } = Select;

  const [permission, setPermission] = useState(null);
  const [typeSelect, setTypeSelect] = useState("User");

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const { isLoading: isLoadingUser, data: users } = useUser();
  const { isLoading: isLoadingGroup, data: groups } = useGroup();
  const {
    isLoading: isLoadingPermission,
    data: permissions,
    refetch,
  } = usePermission(permission);

  const onFormLayoutChange = (value: any) => {
    if (value?.User_Group) {
      formMenuPermission.setFieldsValue({ User_Group_Value: null });
      setTypeSelect(value.User_Group);
    }
  };

  const handleSubmit = (values: any) => {
    setPermission(values);
  };

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    refetch();
  }, [permission]);

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Form
        layout={windowSize.width < 992 ? "vertical" : "inline"}
        form={formMenuPermission}
        initialValues={initDefaultValue}
        onValuesChange={onFormLayoutChange}
        onFinish={handleSubmit}
      >
        <Form.Item label="Platform" name="Platform">
          <Radio.Group buttonStyle="outline">
            <Radio.Button className="radio" value="WA">
              Web
            </Radio.Button>
            <Radio.Button className="radio" value="MA">
              Mobile
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="User / Group" name="User_Group">
          <Radio.Group buttonStyle="outline">
            <Radio.Button className="radio" value="User">
              User
            </Radio.Button>
            <Radio.Button className="radio" value="Group">
              Group
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={typeSelect}
          name="User_Group_Value"
          rules={[{ required: true, message: `Please choose ${typeSelect}` }]}
        >
          <Select
            style={{ width: "15em" }}
            loading={isLoadingUser || isLoadingGroup}
            showSearch
            placeholder={`Select ${typeSelect}`}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {typeSelect === "User"
              ? users?.data.data.map((value: any) => {
                  return (
                    <Option key={value.User_Index} value={value.User_Index}>
                      {value.UserName}
                    </Option>
                  );
                })
              : groups?.data.data.map((value: any) => {
                  return (
                    <Option key={value.Group_Index} value={value.Group_Index}>
                      {value.Name}
                    </Option>
                  );
                })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            icon={<SearchOutlined className="relative bottom-[0.2em]" />}
          >
            Search
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <MenuPermissionList
        filter={
          formMenuPermission.getFieldValue("User_Group_Value") && permission
        }
        permissions={
          formMenuPermission.getFieldValue("User_Group_Value") &&
          permissions?.data?.data
        }
        isLoadingPermission={isLoadingPermission}
      />
    </>
  );
};

export default MenuPermission;
