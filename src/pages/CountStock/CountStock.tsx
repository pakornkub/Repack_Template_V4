import React, { useContext, useState, useEffect, useRef } from "react";
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
  Form,
  Select,
  message,
  DatePicker,
  Card,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  ClearOutlined
} from "@ant-design/icons";
import moment from "moment";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useCountStock,
  useDeleteCountStock,
  useCreateCountStock,
  useUpdateCountStock,
  useCountStockItem,
  useCountStockNo,
  useCountStockSnap,
  useCountStockStatus,
} from "../../hooks/useCountStock";

import { useGrade } from "../../hooks/useGrade";
import { useProductType } from "../../hooks/useProductType";
import { useLocation } from "../../hooks/useLocation";

import type { InputRef } from "antd";
import type { FormInstance } from "antd/lib/form";

import { useSelector } from "react-redux";

import { selectAuth } from "../../contexts/slices/authSlice";
import Template from "../../components/Template2";
import "./CountStock.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: React.Key;
  Location_ID: Number;
  Location: string;
  Product_ID: Number;
  Product_DESCRIPTION: string;
  Grade_ID: Number;
  Grade_Name: string;
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
  Location_ID: Number;
  Location: string;
  Product_ID: Number;
  Product_DESCRIPTION: string;
  Grade_ID: Number;
  Grade_Name: string;
  QTY: Number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const CountStock: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [visible, setVisible] = useState(false);

  const [reecivepartTable, setCountStockTable] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [formCountStock] = Form.useForm();
  const { Option } = Select;

  const [countStockDetail, setViewCountStock] = useState<any>({});
  const [countStockNo, setCountStockNo] = useState(null);

  const [totalQtyBalance, setTotalQtyBalance] = useState<any>(0);
  const [totalQtyActual, setTotalQtyActual] = useState<any>(0);

  const [SearchProductType, setSearchProductType] = useState(null);
  const [SearchLocation, setSearchLocation] = useState(null);
  const [SearchGrade, setSearchGrade] = useState(null);

  const [SearchStockCountID, setStockCountID] = useState(0);

  const [buttonRefresh, setButtonRefresh] = useState(true);

  const {
    data: CountStockItem,
    error: createErrorCountStockItem,
    status: getStatusCountStockItem,
    mutate: getCountStockItem,
  } = useCountStockItem();

  const {
    data: CountStockSnap,
    status: getStatusCountStockSnap,
    mutate: getCountStockSnap,
  } = useCountStockSnap();

  const {
    isFetching,
    data: CountStockdata,
  } = useCountStock();

  const {
    error: createErrorCountStock,
    status: createStatusCountStock,
    mutate: createMutateCountStock,
  } = useCreateCountStock();

  const {
    error: updateErrorCountStock,
    status: updateStatusCountStock,
    mutate: updateMutateCountStock,
  } = useUpdateCountStock();

  const {
    data: CountStockNo,
    status: CountStockNoStatus,
    error: CountStockNoError,
    mutate: getCountStockNo,
  } = useCountStockNo();

  const {
    data: CountStockStatus,
    status: CountStockStatusStatus,
    mutate: getCountStockStatus,
  } = useCountStockStatus();

  const {
    data: CountStockStatus1,
    status: CountStockStatusStatus1,
    mutate: getCountStockStatus1,
  } = useCountStockStatus();

  const {
    data: GradeItem,
  } = useGrade();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteCountStock();

  const {
    data: ProductType,
  } = useProductType();

  const {
    data: Location,
  } = useLocation();

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
  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        setViewCountStock({ ...record, event: e.key });
        getCountStockItem(record.CountStock_ID);
        showModal("Detail");
        setButtonRefresh(false);
        setStockCountID(record.CountStock_ID);

        break;
      case "2":
        if (record.Status > 2) {
          Modal.error({
            title: "Delete message",
            content: `Can't delete this item.`,
          });
        } else {
          Modal.confirm({
            title: "Delete Confirm",
            content: (
              <>{`Do you want delete Stock Count No : ${record.CountStock_DocNo} ?`}</>
            ),
            onOk: () => {
              deleteMutate(record.CountStock_ID);
            },
          });
        }

        break;
    }
  };

  useEffect(() => {
    if (getStatusCountStockItem === "success") {
      setDataSource(CountStockItem?.data.data || []);

      const initialValue = 0;
      if (!CountStockItem?.data || CountStockItem.data.length <= 0) {
        setTotalQtyBalance(0);
      } else {
        const sumWithInitial = CountStockItem?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.Count_Balance),
          initialValue
        );
        const sumWithInitial1 = CountStockItem?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.Count_Actual),
          initialValue
        );
        setTotalQtyBalance(sumWithInitial);
        setTotalQtyActual(sumWithInitial1);
      }
    } else if (getStatusCountStockItem === "error") {
      message.error(
        createErrorCountStockItem?.response?.data?.message ||
          createErrorCountStockItem.message
      );
    }
  }, [getStatusCountStockItem]);

  const handleCancel = () => {
    setVisible(false);
    formCountStock.resetFields();
    setDataSource([]);
    setSelectedRowKeys([]);
    setSearchProductType(null);
    setSearchLocation(null);
    setSearchGrade(null);
    setViewCountStock([]);
    setTotalQtyBalance(0);
    setTotalQtyActual(0);
    setButtonRefresh(true);
    setStockCountID(0);
  };

  const refreshTag = () => {
    setDataSource([]);
    setLoadingRefresh(true);
    setTimeout(() => {
      getCountStockItem(countStockDetail?.CountStock_ID);
      setLoadingRefresh(false);
    }, 300);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const CountStockDataSearch = CountStockdata?.data.data.filter(
        (value: any) => {
          return Object.keys(value).some((key: any) =>
            String(value[key])
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          );
        }
      );
      setCountStockTable(CountStockDataSearch);
    } else {
      setCountStockTable(CountStockdata?.data.data || []);
    }
  };

  useEffect(() => {
    setCountStockTable(CountStockdata?.data.data || []);
  }, [isFetching]);

  useEffect(() => {
    formCountStock.resetFields();

    formCountStock.setFieldsValue({
      CountStock_Index: countStockDetail?.CountStock_ID || null,
      CountStock_No: countStockDetail?.CountStock_DocNo || null,
      CountStock_Date: moment(countStockDetail?.CountStock_Date),
      CountStock_Description: countStockDetail?.Description || null,
      Product_Type: countStockDetail?.Product_DESCRIPTION || null,
      Location: countStockDetail?.Location || null,
      Grade_ID: countStockDetail?.ITEM_CODE || null,
    });
    setSearchProductType(countStockDetail?.Product_ID || null);
    setSearchLocation(countStockDetail?.Location_ID || null);
    setSearchGrade(countStockDetail?.ITEM_ID || null);
  }, [countStockDetail]);

  const funcProductType = (value: any) => {
    setSearchProductType(value);
  };

  const funcLocation = (value: any) => {
    setSearchLocation(value);
  };

  const funcGrade = (value: any) => {
    setSearchGrade(value);
  };

  const onSnap = (value: any) => {
    if (SearchStockCountID == 0) {
      //ถ้าคลิกจากปุ่ม add

      let str = "WHERE 1 = 1";

      if (SearchProductType != undefined || SearchProductType != null) {
        str += " AND Product_ID = " + SearchProductType;
      }
      if (SearchLocation != undefined || SearchLocation != null) {
        str += " AND Location_ID = " + SearchLocation;
      }
      if (SearchGrade != undefined || SearchGrade != null) {
        str += " AND ITEM_ID = " + SearchGrade;
      }
      getCountStockSnap(str);
    } else {
      //ถ้าคลิกจากปุ่ม Detail
      getCountStockStatus(SearchStockCountID);
    }
  };

  useEffect(() => {
    if (getStatusCountStockSnap === "success") {
      setDataSource(CountStockSnap?.data.data || []);
      const initialValue = 0;
      if (!CountStockSnap?.data || CountStockSnap.data.length <= 0) {
        setTotalQtyBalance(0);
      } else {
        const sumWithInitial = CountStockSnap?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.Count_Balance),
          initialValue
        );
        const sumWithInitial1 = CountStockSnap?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.Count_Actual),
          initialValue
        );
        setTotalQtyBalance(sumWithInitial);
        setTotalQtyActual(sumWithInitial1);
      }
    }
  }, [getStatusCountStockSnap]);

  useEffect(() => {
    //Snap
    if (CountStockStatusStatus === "success") {

      if (CountStockStatus?.data.data[0].Status > 2) {
        Modal.error({
          title: "Snap message",
          content: `Can’t Snap due to stock counting`,
        });
      } else {
        let Type = "";
        let Location = "";
        let Grade = "";

        let str = "WHERE 1 = 1";

        if (SearchProductType != undefined || SearchProductType != null) {
          str += " AND Product_ID = " + SearchProductType;
        }
        if (SearchLocation != undefined || SearchLocation != null) {
          str += " AND Location_ID = " + SearchLocation;
        }
        if (SearchGrade != undefined || SearchGrade != null) {
          str += " AND ITEM_ID = " + SearchGrade;
        }

        getCountStockSnap(str);
      }
    }
  }, [CountStockStatusStatus]);

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Product Type",
      dataIndex: "Product_DESCRIPTION",
      align: "center",
      width: "20%",
      // editable: true,
      sorter: (a: any, b: any) => a.Product_DESCRIPTION.localeCompare(b.Product_DESCRIPTION),
    },
    {
      title: "Location",
      dataIndex: "Location",
      width: "20%",
      // editable: true,
      sorter: (a: any, b: any) => a.Location.localeCompare(b.Location),
    },
    {
      title: "Material",
      dataIndex: "ITEM_CODE",
      width: "30%",
      // editable: true,
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "Balance",
      dataIndex: "Count_Balance",
      align: "center",
      width: "15%",
      // editable: true,
      sorter: (a: any, b: any) => a.Count_Balance.localeCompare(b.Count_Balance),
    },
    {
      title: "Actual",
      dataIndex: "Count_Actual",
      align: "center",
      width: "15%",
      // editable: true,
      sorter: (a: any, b: any) => a.Count_Actual.localeCompare(b.Count_Actual),
    },
  ];

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
      }),
    };
  });

  const showModal = (value: any) => {
    setVisible(true);

    if (value == "Add") {
      //ถ้าคลิกปุ่ม Add Gen เลขใบรับใหม่
      getCountStockNo(1);
    }

    formCountStock.resetFields();
    formCountStock.setFieldsValue({
      CountStock_No: CountStockNo?.data.data[0].CountStockNo,
      CountStock_Date: moment(),
    });
  };

  const handleOk = (value: any) => {
    
    const newData = [...dataSource];
    const snapdata = {
      Product_Type: SearchProductType,
      Location: SearchLocation,
      Grade_ID: SearchGrade,
    };

    if (value?.CountStock_Index) {
      if (countStockDetail.Status > 2) {
        Modal.error({
          title: "Edit message",
          content: `Can’t save data due to stock counting`,
        });
      } else {
        if(newData.length < 1){
          message.warning("Can't edit data... Please choose SNAP");
        }else{
          updateMutateCountStock({ data: value, data2: newData, data3: snapdata });
        }
        
      }
    } else {
      if(newData.length < 1){
        message.warning("Can't save data... Please choose SNAP");
      }else{
        createMutateCountStock({ data: value, data2: newData });
      }
      
    }
  };

  useEffect(() => {
    if (createStatusCountStock === "success") {
      message.success("Add Count Stock Success");
      handleCancel();
    } else if (createStatusCountStock === "error") {
      message.error(
        createErrorCountStock?.response?.data?.message ||
          createErrorCountStock.message
      );
    }
  }, [createStatusCountStock]);

  useEffect(() => {
    if (updateStatusCountStock === "success") {
      message.success("Update Count Stock Success");
      handleCancel();
    } else if (updateStatusCountStock === "error") {
      message.error(
        updateErrorCountStock?.response?.data?.message ||
          updateErrorCountStock.message
      );
    }
  }, [updateStatusCountStock]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Count Stock Success");
      // handleCancel();
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  useEffect(() => {
    if (CountStockNoStatus === "success") {
      setCountStockNo(CountStockNo?.data.data[0].CountStockNo);
    } else if (CountStockNoStatus === "error") {
      message.error(
        CountStockNoError?.response?.data?.message || CountStockNoError.message
      );
    }
  }, [CountStockNoStatus]);

  useEffect(() => {
    formCountStock.setFieldsValue({
      CountStock_No: countStockNo || null,
    });
  }, [countStockNo]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onDeleteItem = () => {
    if (SearchStockCountID == 0) {
      let _dataSource = [...dataSource];
      setLoading(true);

      setTimeout(() => {
        setSelectedRowKeys([]);
        setDataSource([]);

        selectedRowKeys.forEach((itemRecord: any) => {
          _dataSource = _dataSource.filter((item) => item.key !== itemRecord);
          setDataSource(_dataSource);

          const initialValue = 0;
          const sumWithInitial = _dataSource.reduce(
            (previousValue: any, currentValue: any) =>
              previousValue + Number(currentValue.Count_Balance),
            initialValue
          );
          const sumWithInitial1 = _dataSource.reduce(
            (previousValue: any, currentValue: any) =>
              previousValue + Number(currentValue.Count_Actual),
            initialValue
          );
          setTotalQtyBalance(sumWithInitial);
          setTotalQtyActual(sumWithInitial1);
        });
        setLoading(false);
      }, 1000);
    } else {
      getCountStockStatus1(SearchStockCountID);
    }
  };

  useEffect(() => {
    //clear กรณี Detail
    if (CountStockStatusStatus1 === "success") {

      if (CountStockStatus1?.data.data[0].Status > 2) {
        Modal.error({
          title: "Clear message",
          content: `Can’t clear data due to stock counting`,
        });
      } else {
        let _dataSource = [...dataSource];
        setLoading(true);

        setTimeout(() => {
          setSelectedRowKeys([]);
          selectedRowKeys.forEach((itemRecord: any) => {
            _dataSource = _dataSource.filter((item) => item.key !== itemRecord);
            setDataSource(_dataSource);

            const initialValue = 0;
            const sumWithInitial = _dataSource.reduce(
              (previousValue: any, currentValue: any) =>
                previousValue + Number(currentValue.Count_Balance),
              initialValue
            );
            const sumWithInitial1 = _dataSource.reduce(
              (previousValue: any, currentValue: any) =>
                previousValue + Number(currentValue.Count_Actual),
              initialValue
            );
            setTotalQtyBalance(sumWithInitial);
            setTotalQtyActual(sumWithInitial1);
          });
          setLoading(false);
        }, 1000);
      }
    }
  }, [CountStockStatusStatus1]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

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
      title: "Count Stock No",
      dataIndex: "CountStock_DocNo",
      key: "CountStock_DocNo",
      align: "center",
      sorter: (a: any, b: any) =>
        a.CountStock_DocNo.localeCompare(b.CountStock_DocNo),
    },

    {
      title: "Date",
      dataIndex: "Date1",
      key: "Date1",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Date1.localeCompare(b.Date1),
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      align: "center",
      responsive: ["lg"],
    },
    {
      title: "SNAP",
      children: [
        {
          title: "Product Type",
          dataIndex: "Product_DESCRIPTION",
          key: "Product_DESCRIPTION",
          align: "center",
          responsive: ["lg"],
          /* render: (text: any, record: any, index: any) =>
            `${record.Title} ${record.FirstName} ${record.LastName}`, */
        },
        {
          title: "Location",
          dataIndex: "Location",
          key: "Location",
          align: "center",
          responsive: ["lg"],
        },
        {
          title: "Material",
          dataIndex: "ITEM_CODE",
          key: "ITEM_CODE",
          align: "center",
          responsive: ["lg"],
        },
      ],
    },

    {
      title: "Status",
      dataIndex: "Status_desc",
      key: "Status_desc",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Status_desc.localeCompare(b.Status_desc),
      render: (text: any, record: any, index: any, color: any) => {
        if (text == "Open") {
          color = "default";
        } else if (text == "Create TAG") {
          color = "warning";
        } else if (text == "Process") {
          color = "processing";
        } else if (text == "Complete") {
          color = "success";
        } else if (text == "Process Lock") {
          color = "error";
        } else if (text == "Process UnLock") {
          color = "processing";
        } else {
          color = "error";
        }
        return (
          <Tag color={color} style={{ width: 100 }}>
            {text}
          </Tag>
        );
      },
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
                className="btn-success"
                icon={<PlusOutlined className="relative bottom-[0.2em]" />}
                onClick={() => showModal("Add")}
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
          title="Count Stock"
          style={{ top: 20 }}
          onOk={formCountStock.submit}
          onCancel={handleCancel}
          width={1000}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={formCountStock.submit}
              icon={<SaveOutlined className="relative bottom-[0.2em]" />}
            >
              Submit
            </Button>,
            <Button
              key="back"
              type="ghost"
              danger
              onClick={handleCancel}
              icon={<CloseOutlined className="relative bottom-[0.2em]" />}
            >
              Cancel
            </Button>,
          ]}
        >
          <Form
            layout="vertical"
            form={formCountStock}
            name="formCountStock"
            onFinish={handleOk}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Card>
                <Form.Item
                  name="CountStock_Index"
                  label="CountStock_Index"
                  hidden
                >
                  <Input />
                </Form.Item>
                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item name="CountStock_No" label="Count Stock No :">
                      <Input style={{ background: "#f5f5f5" }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="CountStock_Date"
                      label="Date :"
                      // rules={[{ required: true, message: "Please select Date" }]}
                    >
                      <DatePicker className="myDatePicker" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="CountStock_Description"
                      label="Description :"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Card>
                  <Row
                    gutter={24}
                    style={{ marginBottom: -30, marginTop: -10 }}
                  >
                    <Col span={7}>
                      <Form.Item name="Product_Type" label="Product Type :">
                        <Select
                          placeholder="Please choose Product Type"
                          onChange={(e) => funcProductType(e)}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option!.children as unknown as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          allowClear
                        >
                          {ProductType?.data?.data?.map((value: any) => {
                            return (
                              <Option
                                key={value.Product_DESCRIPTION}
                                value={value.Product_ID}
                              >
                                {value.Product_DESCRIPTION}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item name="Location" label="Location :">
                        <Select
                          placeholder="Please choose Location"
                          onChange={(e) => funcLocation(e)}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option!.children as unknown as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          allowClear
                        >
                          {Location?.data?.data?.map((value: any) => {
                            return (
                              <Option
                                key={value.Location}
                                value={value.Location_ID}
                              >
                                {value.Location}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item name="Grade_ID" label="Material :">
                        <Select
                          placeholder="Please choose Material"
                          onChange={(e) => funcGrade(e)}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option!.children as unknown as string)
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          allowClear
                        >
                          {GradeItem?.data?.data?.map((value: any) => {
                            return (
                              <Option
                                key={value.ITEM_CODE}
                                value={value.ITEM_ID}
                              >
                                {value.ITEM_CODE}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item label=" ">
                        <Button
                          onClick={onSnap}
                          type="primary"
                          className="btn-info"
                          style={{
                            marginBottom: 16,
                          }}
                        >
                          SNAP
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Card>

              <Card>
                <div>
                  <Table
                    rowSelection={rowSelection}
                    components={components}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                    pagination={false}
                    scroll={{ y: 400 }}
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row>
                          <Table.Summary.Cell
                            index={1}
                            colSpan={4}
                            align="right"
                          >
                            Total :
                          </Table.Summary.Cell>
                          <Table.Summary.Cell
                            index={2}
                            colSpan={1}
                            align="center"
                          >
                            {totalQtyBalance}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell
                            index={2}
                            colSpan={1}
                            align="center"
                          >
                            {totalQtyActual}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                  <Row gutter={16}>
                    <Col>
                      <Button
                        type="primary"
                        className="btn-warning"
                        onClick={onDeleteItem}
                        style={{
                          marginTop: 8,
                        }}
                        disabled={!hasSelected}
                        loading={loading}
                        icon={<ClearOutlined className="relative bottom-[0.2em]" />}
                      >
                        Clear
                      </Button>
                      <span style={{ marginLeft: 8 }}>
                        {hasSelected
                          ? `Selected ${selectedRowKeys.length} items`
                          : ""}
                      </span>
                    </Col>
                    <Col className="flex justify-end items-center" flex={1}>
                      <Button
                        type="primary"
                        onClick={() => {
                          refreshTag();
                        }}
                        style={{
                          marginTop: 8,
                          background: "#7eaff6",
                          borderColor: "#2e7cee",
                        }}
                        loading={loadingRefresh}
                        disabled={buttonRefresh}
                      >
                        Refresh
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Space>
          </Form>
        </Modal>
      </Template>
      ;
    </>
  );
};

export default CountStock;
