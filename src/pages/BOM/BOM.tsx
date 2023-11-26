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
  Popconfirm,
  Card,
  InputNumber,
} from "antd";
import {
  DownOutlined,
  FundViewOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  ClearOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import {
  useBom,
  useDeleteBom,
  useCreateBom,
  useUpdateBom,
  useBomItem,
} from "../../hooks/useBom";
import { useGradeFG } from "../../hooks/useGradeFG";
import { useGradeSP } from "../../hooks/useGradeSP";
import { useBomID } from "../../hooks/useBomID";

import type { InputRef } from "antd";
import type { FormInstance } from "antd/lib/form";
import "./BOM.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  Grade_ID: Number;
  Grade_Name: string;
  Type: string;
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
  Type: string;
  QTY: Number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const BOM: React.FC<any> = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [bomSearch, setBomSearch] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formBOM] = Form.useForm();
  const [formEditItem] = Form.useForm();
  const [formAddItem] = Form.useForm();
  const { Option } = Select;

  const [bomdetail, setBom] = useState<any>({});
  const [BomIDNo, setBomID_BomNo] = useState(null);
  const [RevNo, setBomID_RevNo] = useState(null);

  const [totalQty, setTotalQty] = useState<any>(0);

  const {
    data: BomID,
    error: createError,
    status: getStatusBomID,
    mutate: getBomID,
  } = useBomID();

  const {
    data: BomItem,
    status: getStatusBomItem,
    mutate: getBomItem,
  } = useBomItem();

  const {
    isFetching,
    data: Bomdata,
  } = useBom();

  const {
    status: createStatusBom,
    mutate: createMutateBom,
  } = useCreateBom();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutateBom,
  } = useUpdateBom();

  const {
    data: GradeFG,
  } = useGradeFG();

  const {
    data: GradeSP,
  } = useGradeSP();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteBom();

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
        setBom({ ...record, event: e.key });
        getBomItem(record.BOM_ID);
        showModal();
        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: <>{`Do you want delete Bom ID : ${record.BOM_Name} ?`}</>,
          onOk: () => {
            deleteMutate(record.BOM_ID);
          },
        });

        break;
    }
  };

  useEffect(() => {
    if (getStatusBomItem === "success") {
      setDataSource(BomItem?.data.data || []);
      
      const initialValue = 0;
      if (!BomItem?.data || BomItem.data.data.length <= 0) {
        setTotalQty(0);
      } else {
        const sumWithInitial = BomItem?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.QTY),
          initialValue
        );
        setTotalQty(sumWithInitial);
        //หา key มากที่สุด เวลาเพิ่ม Item เพิ่ม key จะได้ไม่ซ้ำ
        const maxKey = BomItem.data.data.reduce((acc:any, shot:any) => acc = acc > shot.key ? acc : shot.key, 0);
        setCount(maxKey+1);
      }
    } else if (getStatusBomItem === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
    
  }, [getStatusBomItem]);

  const handleCancel = () => {
    setVisible(false);
    formBOM.resetFields();
    setDataSource([]);
    setSelectedRowKeys([]);
    setTotalQty(0);
    setCount(0);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const bomDataSearch = Bomdata?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setBomSearch(bomDataSearch);
    } else {
      setBomSearch(Bomdata?.data.data || []);
    }
  };

  useEffect(() => {
    setBomSearch(Bomdata?.data.data || []);
  }, [isFetching]);

  useEffect(() => {
    formBOM.resetFields();

    formBOM.setFieldsValue({
      BOM_Index: bomdetail?.BOM_ID || null,
      Bom_Id: bomdetail?.BOM_Name,
      Rev_No: bomdetail?.Rev_No,
      Grade_ID_FG: bomdetail?.ITEM_ID,
      Grade_Name_FG: bomdetail?.ITEM_CODE,
      Bom_Date: moment(bomdetail?.BOM_Date),
      Bom_Remark: bomdetail?.Remark,
      Bom_Status: String(bomdetail?.Status || "0"),
    });
  }, [bomdetail]);

  const gradeItemName = (value: any,index:any) => {
    console.log('va =',value);
    const nameArray = 'AddItem'+index;
    if(value != undefined || value != null){
      const Grade = value.split("|");
      
      formAddItem.setFields(
        [{name:[nameArray, 'Type'], value: Grade[2] }]
      )
      formAddItem.setFields(
        [{name:[nameArray, 'key'], value: count }]
      )
      formAddItem.setFields(
        [{name:[nameArray, 'Grade_ID'], value: Number(Grade[0]) }]
      )
      formAddItem.setFields(
        [{name:[nameArray, 'Grade_Name'], value: Grade[1] }]
      )

      setCount(count + 1);
    }else{
      formAddItem.setFields(
        [{name:[nameArray, 'Type'], value: null }]
      )
      formAddItem.setFields(
        [{name:[nameArray, 'key'], value: null }]
      )
      formAddItem.setFields(
        [{name:[nameArray, 'Grade_ID'], value: null }]
      )
      formAddItem.setFields(
        [{name:[nameArray, 'Grade_Name'], value: null }]
      )
    }
    

  };
  

  const gradeItemNameedit = (value: any) => {
    const Grade = value.split("|");

    formEditItem.setFieldsValue({
      Grade_Id_SP: Number(Grade[0]),
      Grade_Name_SP: Grade[1],
      Type: Grade[2],
    });
  };

  const [count, setCount] = useState(1);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    const initialValue = 0;
    const sumWithInitial = newData.reduce(
      (previousValue: any, currentValue: any) =>
        previousValue + Number(currentValue.QTY),
      initialValue
    );
    setTotalQty(sumWithInitial);
  };

  const onAddItem = (record: any) => {
    setIsAdding(true);
  };
  const resetAdding = () => {
    setIsAdding(false);
    formAddItem.resetFields();
  };

  const onEditItem = (record: any) => {
    setIsEditing(true);

    formEditItem.setFieldsValue({
      key: record.key || "",
      Grade_ID: record.Grade_Name || "",
      Grade_Id_SP: record.Grade_ID || "",
      Grade_Name_SP: record.Grade_Name || "",
      Type: record.Type || "",
      Item_Qty: record.QTY || 0,
    });
  };
  const resetEditing = () => {
    setIsEditing(false);
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Material",
      dataIndex: "Grade_Name",
      width: "40%",
      // editable: true,
    },
    {
      title: "Type",
      dataIndex: "Type",
      width: "20%",
      // editable: true,
    },
    {
      title: "QTY",
      dataIndex: "QTY",
      width: "15%",
      align: "center",
      // editable: true,
    },
    {
      title: "",
      dataIndex: "operation",
      align: "center",
      render: (_, record: any) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditItem(record);
              }}
            />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
            </Popconfirm>
          </>
        );
      },
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

  
  const handleSaveAddItem = (value: any) => {
    let sum = 0;
    let _dataSource = [...dataSource];

    delete value.AddItem1.Grade;
    _dataSource.push(value.AddItem1);
    sum = sum+value.AddItem1.QTY;

    if(value.AddItem2.Grade_ID != undefined && value.AddItem2.QTY != undefined){
      delete value.AddItem2.Grade;
      _dataSource.push(value.AddItem2);
      sum = sum+value.AddItem2.QTY;
    }
    if(value.AddItem3.Grade_ID != undefined && value.AddItem3.QTY != undefined){
      delete value.AddItem3.Grade;
      _dataSource.push(value.AddItem3);
      sum = sum+value.AddItem3.QTY;
    }
    if(value.AddItem4.Grade_ID != undefined && value.AddItem4.QTY != undefined){
      delete value.AddItem4.Grade;
      _dataSource.push(value.AddItem4);
      sum = sum+value.AddItem4.QTY;
    }
    if(value.AddItem5.Grade_ID != undefined && value.AddItem5.QTY != undefined){
      delete value.AddItem5.Grade;
      _dataSource.push(value.AddItem5);
      sum = sum+value.AddItem5.QTY;
    }
    if(value.AddItem6.Grade_ID != undefined && value.AddItem6.QTY != undefined){
      delete value.AddItem6.Grade;
      _dataSource.push(value.AddItem6);
      sum = sum+value.AddItem6.QTY;
    }
    if(value.AddItem7.Grade_ID != undefined && value.AddItem7.QTY != undefined){
      delete value.AddItem7.Grade;
      _dataSource.push(value.AddItem7);
      sum = sum+value.AddItem7.QTY;
    }
    if(value.AddItem8.Grade_ID != undefined && value.AddItem8.QTY != undefined){
      delete value.AddItem8.Grade;
      _dataSource.push(value.AddItem8);
      sum = sum+value.AddItem8.QTY;
    }
    if(value.AddItem9.Grade_ID != undefined && value.AddItem9.QTY != undefined){
      delete value.AddItem9.Grade;
      _dataSource.push(value.AddItem9);
      sum = sum+value.AddItem9.QTY;
    }
    if(value.AddItem10.Grade_ID != undefined && value.AddItem10.QTY != undefined){
      delete value.AddItem10.Grade;
      _dataSource.push(value.AddItem10);
      sum = sum+value.AddItem10.QTY;
    }

    const BreakError = {};
    try {
      _dataSource.reduce((previousValue:any, currentValue:any) => {
        const { Grade_ID} = currentValue;
        const index = previousValue.findIndex(
          (entry:any) => entry.Grade_ID === Grade_ID
        );

        if (index === -1) { // ไม่ซ้ำ
          return [...previousValue, currentValue];
          
        }else{ //ซ้ำ แล้วหยุด
          message.error(
            `Can't save due to duplicate the material code`
          );
          throw BreakError;
        }
      }, []);

      setDataSource(_dataSource);
      resetAdding();
      setTotalQty(totalQty + sum);

    } catch (err) {
      if (err !== BreakError) throw err;
    }

  };

 
  const handleSaveEditItem = (value: any) => {

    let _dataSource = [...dataSource];
    const search = (obj:any) => obj.Grade_ID === value.Grade_Id_SP && 
                                obj.key !== value.key;
    const indexFind = _dataSource.findIndex(search);       

    if (indexFind === -1) { //ไม่ซ้ำ
      const new_value = {
        Grade_ID: value.Grade_Id_SP,
        Grade_Name: value.Grade_Name_SP,
        Type: value.Type,
        QTY: value.Item_Qty,
      };
  
      const newData = [...dataSource];
      const index = newData.findIndex((item) => value.key === item.key);
      const item = newData[index];
  
      newData.splice(index, 1, {
        ...item,
        ...new_value,
      });
  
      setDataSource(newData);
      resetEditing();
  
      const initialValue = 0;
      const sumWithInitial = newData.reduce(
        (previousValue: any, currentValue: any) =>
          previousValue + Number(currentValue.QTY),
        initialValue
      );
      setTotalQty(sumWithInitial);     
      
    }else{ //ซ้ำ
      message.error(
        `Can't edit due to duplicate the material code`
      );
      
    }

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

    formBOM.resetFields();
    formBOM.setFieldsValue({
      Bom_Date: moment(),
      Bom_Status: String(bomdetail?.Status || "1"),
    });
  };

  const handleOk = (value: any) => {
    const newData = [...dataSource];

    if (value?.BOM_Index) {
      updateMutateBom({ data: value, data2: newData });
    } else {
      createMutateBom({ data: value, data2: newData });
    }
  };
  useEffect(() => {
    if (createStatusBom === "success") {
      message.success("Add Bom Success");
      handleCancel();
    } else if (createStatusBom === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatusBom]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Bom Success");
      handleCancel();
    } else if (updateStatus === "error") {
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Bom Success");
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  const setBomID = (value: any) => {
    if (value) {
      getBomID(value);
      formBOM.setFieldsValue({
        Grade_ID_FG: value || null,
      });
    }
  };

  useEffect(() => {
    if (getStatusBomID === "success") {
      setBomID_BomNo(BomID.data.data[0].Bom_ID);
      setBomID_RevNo(BomID.data.data[0].Rev_No);
    } else if (getStatusBomID === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [getStatusBomID]);

  useEffect(() => {
    formBOM.setFieldsValue({
      Bom_Id: BomIDNo || null,
      Rev_No: RevNo || 0,
    });
  }, [BomIDNo]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onDeleteItem = () => {
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
            previousValue + Number(currentValue.QTY),
          initialValue
        );
        setTotalQty(sumWithInitial);
      });
      setLoading(false);
    }, 1000);
  };

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
      title: "BOM ID",
      dataIndex: "BOM_Name",
      key: "BOM_Name",
      align: "center",
      sorter: (a: any, b: any) => a.BOM_Name.localeCompare(b.BOM_Name),
    },
    {
      title: "Rev No",
      dataIndex: "Rev_No",
      key: "Rev_No",
      align: "center",
      sorter: (a: any, b: any) => a.Rev_No.localeCompare(b.Rev_No),
    },
    {
      title: "Material (FG)",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "Date",
      dataIndex: "BOM_Date1",
      key: "BOM_Date1",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.BOM_Date1.localeCompare(b.BOM_Date1),
    },
    {
      title: "Remark",
      dataIndex: "Remark",
      key: "Remark",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Remark.localeCompare(b.Remark),
    },

    {
      title: "Active",
      dataIndex: "Status",
      key: "Status",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Status - b.Status,
      render: (text: any, record: any, index: any) => {
        return (
          <Tag color={text == "1" ? "success" : "error"}>
            {text == "1" ? "Active" : "Inactive"}
          </Tag>
        );
      },
    },
    {
      title: "Create By",
      dataIndex: "Add_Date",
      key: "Add_Date",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Add_Date.localeCompare(b.Add_Date),
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
          dataSource={bomSearch}
          pagination={{ pageSize: 50 }}
        />
      </Space>


      {/* -------------------------------------------------Modal Add Item----------------------------------------------------- */}

      <Modal
        title="Add Item"
        visible={isAdding}
        onOk={formAddItem.submit}
        onCancel={resetAdding}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formAddItem.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={resetAdding}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formAddItem}
          name="formAddItem"
          onFinish={handleSaveAddItem}
        >

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                // name="Grade_Id1"
                name={['AddItem1', 'Grade']} 
                label="Material"
                rules={[
                  { required: true, message: "Please choose Material" },
                ]}
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'1')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem1', 'Type']}
                  label="Type"  
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                // name="Item_Qty1"
                name={['AddItem1', 'QTY']} 
                label="QTY"
                rules={[
                  { required: true, message: "Please enter QTY" },
                ]}>
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem1', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem1', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem1', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                // name="Grade_Id2"
                name={['AddItem2', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'2')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem2', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>     
            <Col span={5}>
              <Form.Item 
                // name="Item_Qty2" 
                name={['AddItem2', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem2', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem2', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem2', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem3', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'3')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem3', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>      
            <Col span={5}>
              <Form.Item 
                name={['AddItem3', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem3', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem3', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem3', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem4', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'4')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem4', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                name={['AddItem4', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem4', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem4', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem4', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem5', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'5')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem5', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>      
            <Col span={5}>
              <Form.Item 
                name={['AddItem5', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem5', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem5', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem5', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem6', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'6')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem6', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                name={['AddItem6', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem6', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem6', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem6', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>
                  
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem7', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'7')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem7', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                name={['AddItem7', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem7', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem7', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem7', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem8', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'8')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem8', 'Type']} 
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                name={['AddItem8', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem8', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem8', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem8', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem9', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'9')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem9', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                name={['AddItem9', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem9', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem9', 'Grade_ID']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem9', 'Grade_Name']}  hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['AddItem10', 'Grade']} 
                label=""
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e,'10')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  allowClear
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name={['AddItem10', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                name={['AddItem10', 'QTY']} 
                label="">
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                />
              </Form.Item>
              <Form.Item name={['AddItem10', 'key']}  hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem10', 'Grade_ID']} hidden>
                <Input />
              </Form.Item>
              <Form.Item name={['AddItem10', 'Grade_Name']} hidden>
                <Input />
              </Form.Item>

             
            </Col>
          </Row>

        </Form>
        
      </Modal>

      {/* -------------------------------------------------Modal Edit Item----------------------------------------------------- */}

      <Modal
        title="Edit Item"
        visible={isEditing}
        onOk={formEditItem.submit}
        onCancel={resetEditing}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formEditItem.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={resetEditing}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formEditItem}
          name="formEditItem"
          onFinish={handleSaveEditItem}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="key" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="Grade_ID"
                label="Material"
                rules={[
                  { required: true, message: "Please choose Material" },
                ]}
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemNameedit(e)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {GradeSP?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.ITEM_CODE}
                        value={value.ITEM_ID + "|" + value.ITEM_CODE + "|" + value.Product_DESCRIPTION}
                      >
                        {value.ITEM_CODE}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item 
                  name="Type" 
                  label="Type"
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item 
                name="Item_Qty" 
                label="QTY"
                rules={[
                  { required: true, message: "Please enter QTY" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                  
                />
              </Form.Item>
              <Form.Item name="Grade_Id_SP" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="Grade_Name_SP" hidden>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>





      <Modal
        visible={visible}
        title="BOM"
        style={{ top: 20 }}
        onOk={formBOM.submit}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formBOM.submit}
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
          form={formBOM}
          name="formGrade"
          onFinish={handleOk}
        >
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card>
              <Form.Item name="BOM_Index" label="BOM Index" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="Grade_ID_FG" label="Grade_ID_FG" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="Grade_Name_FG"
                    label="Material (FG)"
                    rules={[
                      {
                        required: true,
                        message: "Please choose Material (FG)",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please choose Material (FG)"
                      onChange={(e) => setBomID(e)}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {GradeFG?.data?.data?.map((value: any) => {
                        return (
                          <Option key={value.ITEM_CODE} value={value.ITEM_ID}>
                            {value.ITEM_CODE}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Bom_Id" label="BOM ID">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="Bom_Date" label="Date">
                    <DatePicker className="myDatePicker" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="Rev_No" label="Rev No">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="Bom_Remark" label="Remark">
                    <Input placeholder="Please enter Remark" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="Bom_Status" label="Status">
                    <Select placeholder="Please choose Status">
                      <Option value="0">Inactive</Option>
                      <Option value="1">Active</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card>
              <div>
                <Button
                  onClick={onAddItem}
                  type="primary"
                  className="btn-success"
                  style={{
                    marginBottom: 16,
                  }}
                  icon={<PlusOutlined className="relative bottom-[0.2em]" />}
                >
                  Add
                </Button>
                <Button
                  type="primary"
                  onClick={onDeleteItem}
                  className="btn-warning"
                  style={{
                    marginLeft: 8,
                    marginBottom: 16,
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
                <Table
                  rowSelection={rowSelection}
                  rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                  components={components}
                  bordered
                  dataSource={dataSource}
                  columns={columns as ColumnTypes}
                  pagination={false}
                  summary={() => (
                    <Table.Summary>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={1} colSpan={3} align="right">
                          Total QTY :
                        </Table.Summary.Cell>
                        <Table.Summary.Cell
                          index={2}
                          colSpan={1}
                          align="center"
                        >
                          {totalQty}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} colSpan={1} />
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              </div>
            </Card>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default BOM;
