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
  Upload,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { SaveOutlined, CloseOutlined, InboxOutlined } from "@ant-design/icons";
import * as AntdIcons from "@ant-design/icons";

import {
  useCreateMenu,
  useUpdateMenu,
  useParentMenu,
  useMenu,
} from "../../hooks/useMenu";
import { useMenuType } from "../../hooks/useMenuType";
import { usePlatform } from "../../hooks/usePlatform";

import IconData from "../../data/IconData";

const FormMenu: React.FC<any> = ({ visible, handleCloseDrawer, menu }) => {
  const { Option, OptGroup } = Select;

  const [formMenu] = Form.useForm();

  const [parent, setParent] = useState<any>([]);
  const [groupParent, setGroupParent] = useState<any>([]);
  const [seq, setSeq] = useState<any>([]);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const propsFile = {
    beforeUpload: (file: any) => {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpg" || file.type === "image/jpeg";

      if (!isPNG && !isJPG) {
        message.error(`${file.name} is not a png or jpg file`);
      }
      return isPNG || isJPG || Upload.LIST_IGNORE;
    },
    onChange: (info: any) => {
      //console.log(info.fileList);
      setFileList(info.fileList);
    },
  };

  const {
    data: menuType,
  } = useMenuType();

  const {
    data: platform,
  } = usePlatform();

  const {
    data: menus,
  } = useMenu();

  const {
    data: parentData,
    mutate: parentMutate,
  } = useParentMenu();

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateMenu();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateMenu();

  const handleSubmit = (value: any) => {
    if (value?.Menu_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };

  const handleParent = (MenuType_Index: any, Platform_Index: any) => {
    formMenu.setFieldsValue({ Route: null, Seq: null });

    if (MenuType_Index == 1 || MenuType_Index == 2) {
      setGroupParent([]);
      setParent([]);

      setSeq([
        ...menus?.data?.data
          .filter(
            (value: any) =>
              (parseInt(value.MenuType_Index) === 1 ||
                parseInt(value.MenuType_Index) === 2) &&
              parseInt(value.Platform_Index) === parseInt(Platform_Index)
          )
          .map((value: any) => value.Seq),

        menus?.data?.data.filter(
          (value: any) =>
            (parseInt(value.MenuType_Index) === 1 ||
              parseInt(value.MenuType_Index) === 2) &&
            parseInt(value.Platform_Index) === parseInt(Platform_Index)
        ).length
          ? Math.max(
              ...menus?.data?.data
                .filter(
                  (value: any) =>
                    (parseInt(value.MenuType_Index) === 1 ||
                      parseInt(value.MenuType_Index) === 2) &&
                    parseInt(value.Platform_Index) === parseInt(Platform_Index)
                )
                .map((value: any) => value.Seq)
            ) + 1
          : 1,
      ]);

      if (parseInt(menu?.event) !== 0) {
        setSeq((currentSeq: any) => currentSeq.slice(0, currentSeq.length - 1));
      }
    } else {
      setSeq([]);
      parentMutate();
    }
  };

  const handleSeq = (Seq: any) => {
    //if group is main menu
    if (!Seq) {
      return;
    }

    const option = Seq.split("|");

    const parentGroup = option[0];
    const parentMenu = option[1];

    formMenu.setFieldsValue({ Seq: null });

    if (parentGroup == 1 || parentGroup == 2) {
      setSeq([
        ...menus?.data?.data
          .filter(
            (value: any) =>
              parseInt(value.Route.split(".")[0]) === parseInt(parentMenu) &&
              parseInt(value.Route.split(".")[2]) === 0 &&
              parseInt(value.Menu_Index) !== parseInt(parentMenu)
          )
          .map((value: any) => value.Seq),

        menus?.data?.data.filter(
          (value: any) =>
            parseInt(value.Route.split(".")[0]) === parseInt(parentMenu) &&
            parseInt(value.Route.split(".")[2]) === 0 &&
            parseInt(value.Menu_Index) !== parseInt(parentMenu)
        ).length
          ? Math.max(
              ...menus?.data?.data
                .filter(
                  (value: any) =>
                    parseInt(value.Route.split(".")[0]) ===
                      parseInt(parentMenu) &&
                    parseInt(value.Route.split(".")[2]) === 0 &&
                    parseInt(value.Menu_Index) !== parseInt(parentMenu)
                )
                .map((value: any) => value.Seq)
            ) + 1
          : 1,
      ]);
    } else {
      setSeq([
        ...menus?.data?.data
          .filter(
            (value: any) =>
              ((parseInt(value.Route.split(".")[1]) === parseInt(parentMenu) &&
                parseInt(value.Route.split(".")[3]) === 0) ||
                parseInt(value.Route.split(".")[2]) === parseInt(parentMenu)) &&
              parseInt(value.Menu_Index) !== parseInt(parentMenu)
          )
          .map((value: any) => value.Seq),

        menus?.data?.data.filter(
          (value: any) =>
            ((parseInt(value.Route.split(".")[1]) === parseInt(parentMenu) &&
              parseInt(value.Route.split(".")[3]) === 0) ||
              parseInt(value.Route.split(".")[2]) === parseInt(parentMenu)) &&
            parseInt(value.Menu_Index) !== parseInt(parentMenu)
        ).length
          ? Math.max(
              ...menus?.data?.data
                .filter(
                  (value: any) =>
                    ((parseInt(value.Route.split(".")[1]) ===
                      parseInt(parentMenu) &&
                      parseInt(value.Route.split(".")[3]) === 0) ||
                      parseInt(value.Route.split(".")[2]) ===
                        parseInt(parentMenu)) &&
                    parseInt(value.Menu_Index) !== parseInt(parentMenu)
                )
                .map((value: any) => value.Seq)
            ) + 1
          : 1,
      ]);
    }

    if (parseInt(menu?.event) !== 0) {
      setSeq((currentSeq: any) => currentSeq.slice(0, currentSeq.length - 1));
    }
  };

  const handleResetAll = () => {
    //reset state
    setParent([]);
    setGroupParent([]);
    setSeq([]);
    setFileList([]);

    //reset form
    formMenu.resetFields();
  };

  useEffect(() => {
    const MenuType_Index = formMenu.getFieldValue("MenuType_Index");
    const Platform_Index = formMenu.getFieldValue("Platform_Index");

    setGroupParent(menuType?.data?.data || []);
    if (MenuType_Index == 3 || MenuType_Index == 4) {
      //filter menu not over rank mask route
      setParent(
        parentData?.data?.data.filter(
          (value: any) =>
            (parseInt(value.Route.split(".")[1]) === 0 ||
              parseInt(value.Route.split(".")[2]) === 0 ||
              parseInt(value.Route.split(".")[3]) === 0) &&
            parseInt(value.Platform_Index) === parseInt(Platform_Index) &&
            parseInt(value.Menu_Index) !== parseInt(menu?.Menu_Index || null) // case change MenuType not choose menu self
        ) || []
      );
    } else if (MenuType_Index == 5 || MenuType_Index == 6) {
      setParent(
        parentData?.data?.data.filter(
          (value: any) =>
            (parseInt(value.Route.split(".")[1]) === 0 ||
              parseInt(value.Route.split(".")[2]) === 0) &&
            parseInt(value.Platform_Index) === parseInt(Platform_Index) &&
            parseInt(value.Menu_Index) !== parseInt(menu?.Menu_Index || null) // case change MenuType not choose menu self
        ) || []
      );
    }
  }, [parentData]);

  useEffect(() => {
    handleResetAll();

    //if event is edit, action function set state
    if (menu?.event && parseInt(menu?.event) !== 0) {
      handleParent(menu?.MenuType_Index || null, menu?.Platform_Index || null);
      handleSeq(
        menu?.ParentMenuType_Index &&
          menu?.ParentMenu_Index &&
          menu?.ParentRoute
          ? `${menu?.ParentMenuType_Index}|${menu?.ParentMenu_Index}|${menu?.ParentRoute}`
          : null
      );
    }

    //set form value
    formMenu.setFieldsValue({
      Menu_Index: menu?.Menu_Index || null,
      Id: menu?.Id || "",
      Name: menu?.Name || "",
      MenuType_Index: menu?.MenuType_Index || null,
      Platform_Index: menu?.Platform_Index || null,
      Route:
        menu?.ParentMenuType_Index &&
        menu?.ParentMenu_Index &&
        menu?.ParentRoute
          ? `${menu?.ParentMenuType_Index}|${menu?.ParentMenu_Index}|${menu?.ParentRoute}`
          : null,
      Seq: menu?.Seq || null,
      Icon: menu?.Icon || null,
      //Picture: menu?.Picture || null,
      Des: menu?.Des || "",
      IsParent: String(menu?.IsParent || "0"),
      IsUse: menu?.event === "0" ? "1" : String(menu?.IsUse),
    });

    if (menu?.Picture) {
      formMenu.setFieldsValue({
        Picture: [
          {
            uid: "-1",
            name: menu?.Picture,
            status: "done",
            url: `${import.meta.env.VITE_APP_API_URL}/uploads/${menu?.Picture}`,
          },
        ],
      });
      setFileList([
        {
          uid: "-1",
          name: menu?.Picture,
          status: "done",
          url: `${import.meta.env.VITE_APP_API_URL}/uploads/${menu?.Picture}`,
        },
      ]);
    }
  }, [menu]);

  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Menu Success");
      handleResetAll();
      formMenu.setFieldsValue({ IsParent: "0", IsUse: "1" });
    } else if (createStatus === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Menu Success");
    } else if (updateStatus === "error") {
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);

  return (
    <>
      <Drawer
        title="Create Menu"
        placement="right"
        onClose={handleCloseDrawer}
        visible={visible}
        size={"large"}
        getContainer={false}
        maskClosable={false}
      >
        <Form
          layout="vertical"
          form={formMenu}
          name="formMenu"
          onFinish={handleSubmit}
        >
          <Form.Item name="Menu_Index" label="Menu_Index" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Id"
                label="Id"
                rules={[
                  { required: true, message: "Please enter menu id" },
                  {
                    pattern: new RegExp(/^[a-zA-Z]+$/),
                    message: "Please enter letters only",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, valueInput) {
                      const countDuplicate = menus?.data?.data.filter(
                        (valueMenu: any) => valueMenu.Id == valueInput
                      ).length;

                      if (
                        (parseInt(countDuplicate) === 0 &&
                          parseInt(menu?.event) === 0) ||
                        (parseInt(countDuplicate) === 1 &&
                          parseInt(menu?.event) !== 0)
                      ) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Duplicate menu id with other menus!")
                      );
                    },
                  }),
                ]}
              >
                <Input
                  disabled={parseInt(menu?.event) !== 0 ? true : false}
                  placeholder="Please enter menu id"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Name"
                label="Menu Name"
                rules={[{ required: false, message: "Please enter menu name" }]}
              >
                <Input placeholder="Please enter menu name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Platform_Index"
                label="Platform"
                rules={[{ required: true, message: "Please choose platform" }]}
              >
                <Select
                  placeholder="Please choose platform"
                  onSelect={() =>
                    formMenu.setFieldsValue({
                      MenuType_Index: null,
                      Route: null,
                      Seq: null,
                    })
                  }
                  disabled={parseInt(menu?.event) !== 0 ? true : false}
                >
                  {platform?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.Platform_Index}
                        value={value.Platform_Index}
                      >
                        {value.Des}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="MenuType_Index"
                label="Menu Type"
                rules={[{ required: true, message: "Please choose menu type" }]}
              >
                <Select
                  placeholder="Please choose menu type"
                  onSelect={(v: any) =>
                    handleParent(v, formMenu.getFieldValue("Platform_Index"))
                  }
                  disabled={parseInt(menu?.event) !== 0 ? true : false}
                >
                  {menuType?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.MenuType_Index}
                        value={value.MenuType_Index}
                      >
                        {value.Name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Route"
                label="Parent Menu"
                rules={[
                  { required: false, message: "Please choose parent menu" },
                ]}
              >
                <Select
                  placeholder="Please choose parent menu"
                  onSelect={handleSeq}
                  disabled={parseInt(menu?.event) !== 0 ? true : false}
                >
                  {groupParent
                    ?.filter(
                      (value: any) =>
                        value.MenuType_Index == 1 ||
                        value.MenuType_Index == 2 ||
                        value.MenuType_Index == 5 ||
                        value.MenuType_Index == 6
                    )
                    .map((valueOptionGroup: any) => {
                      return (
                        <OptGroup
                          key={valueOptionGroup.MenuType_Index}
                          label={valueOptionGroup.Name}
                        >
                          {parent
                            ?.filter(
                              (value: any) =>
                                value.MenuType_Index ==
                                valueOptionGroup.MenuType_Index
                            )
                            .map((valueOption: any) => {
                              return (
                                <Option
                                  key={valueOption.Menu_Index}
                                  value={`${valueOptionGroup.MenuType_Index}|${valueOption.Menu_Index}|${valueOption.Route}`}
                                >
                                  {valueOption.Name}
                                </Option>
                              );
                            })}
                        </OptGroup>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Seq"
                label="Seq"
                rules={[{ required: true, message: "Please choose seq" }]}
              >
                <Select placeholder="Please choose seq">
                  {seq
                    ?.sort((a: any, b: any) => b - a)
                    ?.map((Seq: any) => {
                      return (
                        <Option key={Seq} value={Seq}>
                          {Seq}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Icon"
                label="Icon"
                rules={[{ required: false, message: "Please choose icon" }]}
              >
                <Select showSearch allowClear placeholder="Please choose icon">
                  {IconData?.map((value: any, index: number) => {
                    const AntdIcon: any =
                      AntdIcons[value as keyof typeof AntdIcons];

                    return (
                      <Option key={index} value={value}>
                        <span className="relative bottom-1 mr-2"><AntdIcon /></span>{value}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="IsParent"
                label="IsParent"
                rules={[{ required: true, message: "Please choose IsParent" }]}
              >
                <Select placeholder="Please choose IsParent" disabled={parseInt(menu?.event) !== 0 ? true : false}>
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
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
            <Col span={24}>
              <Form.Item label="Picture">
                <Form.Item name="Picture" noStyle>
                  <Upload.Dragger
                    {...propsFile}
                    listType="picture"
                    fileList={fileList}
                    maxCount={1}
                    name="files"
                    action="/"
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file (png, jpg) to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single upload.
                    </p>
                  </Upload.Dragger>
                </Form.Item>
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

export default FormMenu;
