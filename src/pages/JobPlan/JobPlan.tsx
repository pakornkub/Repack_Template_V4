import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Space,
  Dropdown,
  Button,
  Menu,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  Card,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useJobPlan,
  useDeleteJobPlan,
  useCreateJobPlan,
  useUpdateJobPlan,
} from "../../hooks/useJobPlan";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/lib/form";
import { useSelector } from "react-redux";
import { selectAuth } from "../../contexts/slices/authSlice";
import Template from "../../components/Template2";
import "./JobPlan.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  Grade_ID: Number;
  Grade_Name: string;
  Lot_No: string;
  QTY: Number;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  Grade_ID: Number;
  Grade_Name: string;
  Lot_No: string;
  QTY: Number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const JobPlan: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reecivepartTable, setReecivepartTable] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [formJobPlan] = Form.useForm();
  const [items, setItems] = useState<any>([]);

  const {
    isFetching,
    data: JobPlandata,
  } = useJobPlan();

  const {
    error: createErrorJobPlan,
    status: createStatusJobPlan,
    mutate: createMutateJobPlan,
  } = useCreateJobPlan();

  const {
    error: updateErrorJobPlan,
    status: updateStatusJobPlan,
    mutate: updateMutateJobPlan,
  } = useUpdateJobPlan();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteJobPlan();

  const menu = (record: any) => (
    <Menu
      onClick={(e) => {
        handleMenu(e, record);
      }}
    >
      <Menu.Item key="2" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: <>{`Do you want delete ?`}</>,
          onOk: () => {
            deleteMutate(record.Plan_id);
          },
        });

        break;
    }
  };

  const handleCancel = () => {
    setVisible(false);
    formJobPlan.resetFields();
    setDataSource([]);
    setItems([]);
    setStateTitle("");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const JobPlanDataSearch = JobPlandata?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setReecivepartTable(JobPlanDataSearch);
    } else {
      setReecivepartTable(JobPlandata?.data.data || []);
    }
  };

  useEffect(() => {
    setReecivepartTable(JobPlandata?.data.data || []);
  }, [isFetching]);

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "DATE",
      dataIndex: "DATE",
      align: "center",
      width: "25%",
      // editable: true,
    },
    {
      title: "Material",
      dataIndex: "GRADE",
      align: "center",
      width: "35%",
      // editable: true,
    },

    {
      title: "QTY",
      dataIndex: "QTY",
      align: "center",
      width: "20%",
      // editable: true,
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const showModal = () => {
    setVisible(true);
    formJobPlan.resetFields();
  };

  const handleOk = (value: any) => {
    const newData = [...items];
    createMutateJobPlan({ data: newData });
  };

  useEffect(() => {
    if (createStatusJobPlan === "success") {
      message.success("Add Job Plan Success");
      handleCancel();
    } else if (createStatusJobPlan === "error") {
      message.error(
        createErrorJobPlan?.response?.data?.message ||
          createErrorJobPlan.message
      );
    }
  }, [createStatusJobPlan]);

  useEffect(() => {
    if (updateStatusJobPlan === "success") {
      message.success("Update Job Plan Success");
    } else if (updateStatusJobPlan === "error") {
      message.error(
        updateErrorJobPlan?.response?.data?.message ||
          updateErrorJobPlan.message
      );
    }
  }, [updateStatusJobPlan]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Job Plan Success");
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  const fileRef = useRef<HTMLInputElement>(null);

  const [stateTitle, setStateTitle] = useState<any>("");

  const onChange = (e: any) => {
    const [file] = e.target.files;

    setStateTitle(e.target.files[0].name);

    const reader = new FileReader();

    reader.onload = (evt: any) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setItems(data);
    };
    reader.readAsBinaryString(file);
  };

  const columns_main = [
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
      title: "Date",
      dataIndex: "DATE",
      key: "DATE",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.DATE.localeCompare(b.DATE),
    },
    {
      title: "Material",
      dataIndex: "FG_ITEM_CODE",
      key: "FG_ITEM_CODE",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.FG_ITEM_CODE.localeCompare(b.FG_ITEM_CODE),
      /* render: (text: any, record: any, index: any) =>
        `${record.Title} ${record.FirstName} ${record.LastName}`, */
    },
    {
      title: "QTY",
      dataIndex: "ITEM_QTY",
      key: "ITEM_QTY",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.ITEM_QTY.localeCompare(b.ITEM_QTY),
    },

    {
      title: "Create By",
      dataIndex: "Create_By",
      key: "Create_By",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Create_By.localeCompare(b.Create_By),
    },
  ];

  return (
    <>
      <Template
        mainMenuId={MenuId}
        listSubMenu={authResult.data.permission.filter(
          (value: any) => parseInt(value.Route.split(".")[0]) === Menu_Index
        )}
      >
        <Space className="w-[100%]" direction="vertical">
          <Row>
            <Col flex={1}>
              <Button
                type="primary"
                style={{ background: "green", borderColor: "green" }}
                icon={<PlusOutlined className="relative bottom-[0.2em]" />}
                onClick={showModal}
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
            rowKey={(record: any) => record.User_Index}
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
            bordered
            size="small"
            // loading={isLoading}
            columns={columns_main as any}
            dataSource={reecivepartTable}
            pagination={{ pageSize: 50 }}
          />
        </Space>

        <Modal
          visible={visible}
          title="Job Planning"
          style={{ top: 20 }}
          onOk={formJobPlan.submit}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={formJobPlan.submit}
              style={{ background: "green", borderColor: "green" }}
              icon={<SaveOutlined className="relative bottom-[0.2em]" />}
            >
              Submit
            </Button>,
            <Button
              key="back"
              type="primary"
              onClick={handleCancel}
              style={{ background: "red", borderColor: "red" }}
              icon={<CloseOutlined className="relative bottom-[0.2em]" />}
            >
              Cancel
            </Button>,
          ]}
        >
          <Form
            layout="vertical"
            form={formJobPlan}
            name="formJobPlan"
            onFinish={handleOk}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Card>
                <Row gutter={16} style={{ marginBottom: 8 }}>
                  <Col span={12}>
                    <div>
                      <table>
                        <tr>
                          <td>
                            <Button
                              icon={<UploadOutlined />}
                              onClick={() => fileRef.current!.click()}
                            >
                              Upload Excel only
                            </Button>
                            <input
                              ref={fileRef}
                              onChange={onChange}
                              type="file"
                              accept=".xlsx, .xls"
                              hidden
                            />
                          </td>
                          <td>
                            <span
                              className="ant-upload-list-item-name"
                              title={stateTitle}
                            >
                              {stateTitle}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    {/* <Upload {...props}>
                      <Button icon={<UploadOutlined />}>Upload png only</Button>
                    </Upload> */}
                  </Col>
                </Row>

                <Table
                  components={components}
                  rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                  bordered
                  dataSource={items}
                  columns={columns as ColumnTypes}
                  pagination={false}
                />
              </Card>
            </Space>
          </Form>
        </Modal>
      </Template>
      ;
    </>
  );
};

export default JobPlan;
