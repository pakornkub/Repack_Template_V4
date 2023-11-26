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
  Switch,
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  QrcodeOutlined,
  ClearOutlined
} from "@ant-design/icons";
import moment from "moment";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useReceivePart,
  useDeleteReceivePart,
  useCreateReceivePart,
  useUpdateReceivePart,
  useReceivePartItem,
} from "../../hooks/useReceivePart";
import { useReceiveNo } from "../../hooks/useReceiveNo";
import { useGradeSP } from "../../hooks/useGradeSP";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/lib/form";
import { useSelector } from "react-redux";
import { selectAuth } from "../../contexts/slices/authSlice";
import Template from "../../components/Template2";
import FormTag from "./TagQR";
import "./ReceivePart.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  Grade_ID: Number;
  Grade_Name: string;
  Type: string;
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
      // console.log("Save failed:", errInfo);
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
  Lot_No: string;
  QTY: Number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ReceivePart: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibletag, setVisibleTag] = useState(false);
  const [eventItem, setEventItem] = useState("Add");
  const [reecivepartTable, setReecivepartTable] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [AddingItem, setAddingItem] = useState(null);
  const [formReceivePart] = Form.useForm();
  const [formEditItem] = Form.useForm();
  const [formAddItem] = Form.useForm();
  const { Option } = Select;

  const [receivedetail, setViewReceive] = useState<any>({});
  const [ReceiveNo, setReceive] = useState(null);

  const [totalQty, setTotalQty] = useState<any>(0);
  const [statusCreate, setStatusCreate] = useState<any>(null);

  const {
    data: ReceivePartItem,
    error: createErrorReceivePartItem,
    status: getStatusReceivePartItem,
    mutate: getReceivePartItem,
  } = useReceivePartItem();

  const {
    isFetching,
    data: ReceivePartdata,
    refetch: mainrefetch,
  } = useReceivePart();

  const {
    error: createErrorReceivePart,
    status: createStatusReceivePart,
    mutate: createMutateReceivePart,
  } = useCreateReceivePart();

  const {
    error: updateErrorReceivePart,
    status: updateStatusReceivePart,
    mutate: updateMutateReceivePart,
  } = useUpdateReceivePart();

  const {
    data: DocNo,
    status: RCNoStatus,
    error: RCNoError,
    mutate: getReceiveNo,
  } = useReceiveNo();

  const {
    data: GradeItem,
  } = useGradeSP();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteReceivePart();

  const handleShowModelTag = () => {
    setVisibleTag(true);
  };

  const handleCloseModelTag = () => {
    setVisibleTag(false);
    mainrefetch();
  };

  const menu = (record: any) => (
    <Menu
      onClick={(e) => {
        handleMenu(e, record);
      }}
    >
      <Menu.Item key="1" icon={<EditOutlined />}>
        Detail
      </Menu.Item>
      <Menu.Item key="2" icon={<QrcodeOutlined />}>
        Tag
      </Menu.Item>
      <Menu.Item key="3" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        setViewReceive({ ...record, event: e.key });
        getReceivePartItem(record.Rec_ID);
        showModal("Detail");

        break;
      case "2":
        setViewReceive({ ...record, event: e.key });
        handleShowModelTag();
        break;
      case "3":
        if (record.status > 2) {
          Modal.error({
            title: "Message",
            content: `Can't delete Receive No : ${record.Rec_NO}`,
          });
        } else {
          Modal.confirm({
            title: "Delete Confirm",
            content: (
              <>{`Do you want delete Receive No : ${record.Rec_NO} ?`}</>
            ),
            onOk: () => {
              deleteMutate(record.Rec_ID);
            },
          });
        }

        break;
    }
  };  

  useEffect(() => {
    if (getStatusReceivePartItem === "success") {
      setDataSource(ReceivePartItem?.data.data || []);
      
      const initialValue = 0;
      if (!ReceivePartItem?.data || ReceivePartItem.data.data.length <= 0) {
        setTotalQty(0);
      } else {
        const sumWithInitial = ReceivePartItem?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.QTY),
          initialValue
        );
        setTotalQty(sumWithInitial);
        
        //หา key มากที่สุด เวลาเพิ่ม Item เพิ่ม key จะได้ไม่ซ้ำ
        const maxKey = ReceivePartItem.data.data.reduce((acc:any, shot:any) => acc = acc > shot.key ? acc : shot.key, 0);
        setCount(maxKey+1);

      }
    } else if (getStatusReceivePartItem === "error") {
      message.error(
        createErrorReceivePartItem?.response?.data?.message ||
          createErrorReceivePartItem.message
      );
    }
  }, [getStatusReceivePartItem]);

  const handleCancel = () => {
    setVisible(false);
    formReceivePart.resetFields();
    setDataSource([]);
    setSelectedRowKeys([]);
    setViewReceive({});
    setTotalQty(0);
    setStatusCreate(null);
    setCount(0);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const ReceivePartDataSearch = ReceivePartdata?.data.data.filter(
        (value: any) => {
          return Object.keys(value).some((key: any) =>
            String(value[key])
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          );
        }
      );
      setReecivepartTable(ReceivePartDataSearch);
    } else {
      setReecivepartTable(ReceivePartdata?.data.data || []);
    }
  };

  useEffect(() => {
    setReecivepartTable(ReceivePartdata?.data.data || []);
  }, [isFetching]);

  useEffect(() => {
    formReceivePart.resetFields();

    formReceivePart.setFieldsValue({
      Receive_Index: receivedetail?.Rec_ID || null,
      Receive_No: receivedetail?.Rec_NO || null,
      Receive_Type: "Receive",
      Receive_Date: moment(receivedetail?.Rec_Datetime),
      Receive_Remark: receivedetail?.Remark || null,
      Ref_No1: receivedetail?.Ref_DocNo_1 || null,
      Ref_No2: receivedetail?.Ref_DocNo_2 || null,
    });
  }, [receivedetail]);

  const gradeItemName = (value: any,index:any) => {
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
      Grade_Id_Item: Number(Grade[0]),
      Grade_Name_Item: Grade[1],
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
    if (receivedetail.status > 1 && statusCreate != 'New') {
      Modal.error({
        title: "Add message",
        content: `Can't add items because the Tag is already managed`,
      });
    }else{
      setIsAdding(true)
    }
  };
  const resetAdding = () => {
    setIsAdding(false);
    setAddingItem(null);
    formAddItem.resetFields();
  };

  const onEditItem = (record: any) => {
    setIsEditing(true);

    formEditItem.setFieldsValue({
      key: record.key || "",
      Grade_ID: record.Grade_Name || "",
      Grade_Id_Item: record.Grade_ID || "",
      Grade_Name_Item: record.Grade_Name || "",
      Type: record.Type || "",
      Lot_No: record.Lot_No || "",
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
      width: "30%",
      // editable: true,
    },
    {
      title: "Type",
      dataIndex: "Type",
      width: "20%",
      // editable: true,
    },
    {
      title: "Lot No",
      dataIndex: "Lot_No",
      align: "center",
      width: "20%",
      // editable: true,
    },
    {
      title: "QTY",
      dataIndex: "QTY",
      align: "center",
      // editable: true,
    },
    {
      title: "",
      dataIndex: "operation",
      align: "center",
      render: (_, record: any) => {
        if (eventItem == "Add" || receivedetail.Total_Tag == 0) {
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
        }
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
        const { Grade_ID, Lot_No } = currentValue;
        const index = previousValue.findIndex(
          (entry:any) => entry.Grade_ID === Grade_ID && 
          (entry.Lot_No === Lot_No || 
            (entry.Lot_No === '' && Lot_No === undefined || 
            (entry.Lot_No === '' && Lot_No === null)|| 
            (entry.Lot_No === null && Lot_No === '') || 
            (entry.Lot_No === null && Lot_No === undefined) || 
            (entry.Lot_No === undefined && Lot_No === '') || 
            (entry.Lot_No === undefined && Lot_No === null))
          )
        );
        if (index === -1) { //ไม่ซ้ำ
          return [...previousValue, currentValue];
          
        }else{ //มีซ้ำแล้วให้หยุด
          message.error(
            `Can't save due to duplicate the material code and Lot No.`
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
    const search = (obj:any) => obj.Grade_ID === value.Grade_Id_Item && 
                                (obj.Lot_No === value.Lot_No || 
                                  (obj.Lot_No === value.Lot_No || 
                                    (obj.Lot_No === '' && value.Lot_No === undefined || 
                                    (obj.Lot_No === '' && value.Lot_No === null)|| 
                                    (obj.Lot_No === null && value.Lot_No === '') || 
                                    (obj.Lot_No === null && value.Lot_No === undefined) || 
                                    (obj.Lot_No === undefined && value.Lot_No === '') || 
                                    (obj.Lot_No === undefined && value.Lot_No === null))
                                  )) &&
                                obj.key !== value.key;
    const indexFind = _dataSource.findIndex(search);                

    if (indexFind === -1) { //ไม่ซ้ำ
      const new_value = {
        Grade_ID: value.Grade_Id_Item,
        Grade_Name: value.Grade_Name_Item,
        Type: value.Type,
        Lot_No: value.Lot_No,
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
        `Can't edit due to duplicate the material code and Lot No.`
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

  const showModal = (value: any) => {
    setVisible(true);
    setEventItem(value);

    if (value == "Add") {
      //ถ้าคลิกปุ่ม Add Gen เลขใบรับใหม่
      getReceiveNo(1);
      setStatusCreate('New');
    }

    formReceivePart.resetFields();
    formReceivePart.setFieldsValue({
      Receive_No: DocNo?.data.data[0].ReceiveNo,
      Receive_Type: "Receive",
      Receive_Date: moment(),
    });
  };

  const handleOk = (value: any) => {
    const newData = [...dataSource];
    if (value?.Receive_Index) {

      if (receivedetail.status > 1) {
        Modal.error({
          title: "Edit message",
          content: `Can't edit data because the tag is already managed`,
        });
      }else{
        updateMutateReceivePart({ data: value, data2: newData });
      }
    } else {
      getReceiveNo(1);

      createMutateReceivePart({ data: value, data2: newData });
    }
  };

  useEffect(() => {
    if (createStatusReceivePart === "success") {
      message.success("Add Receive Part Success");
      handleCancel();
    } else if (createStatusReceivePart === "error") {
      message.error(
        createErrorReceivePart?.response?.data?.message ||
          createErrorReceivePart.message
      );
    }
  }, [createStatusReceivePart]);

  useEffect(() => {
    if (updateStatusReceivePart === "success") {
      message.success("Update ReceivePart Success");
      handleCancel();
    } else if (updateStatusReceivePart === "error") {
      message.error(
        updateErrorReceivePart?.response?.data?.message ||
          updateErrorReceivePart.message
      );
    }
  }, [updateStatusReceivePart]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Receive Part Success");
      // handleCancel();
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  useEffect(() => {
    if (RCNoStatus === "success") {
      setReceive(DocNo?.data.data[0].ReceiveNo);
    } else if (RCNoStatus === "error") {
      message.error(RCNoError?.response?.data?.message || RCNoError.message);
    }
  }, [RCNoStatus]);

  useEffect(() => {
    formReceivePart.setFieldsValue({
      Receive_No: ReceiveNo || null,
    });
  }, [ReceiveNo]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onDeleteItem = () => {
    if (receivedetail.Total_Tag > 0) {
      Modal.error({
        title: "Clear message",
        content: `Can't clear item because the tag is already managed`,
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
              previousValue + Number(currentValue.QTY),
            initialValue
          );
          setTotalQty(sumWithInitial);
        });
        setLoading(false);
      }, 1000);
    }
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
      title: "Receive No",
      dataIndex: "Rec_NO",
      key: "Rec_NO",
      align: "center",
      sorter: (a: any, b: any) => a.Rec_NO.localeCompare(b.Rec_NO),
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
      title: "Job Type",
      dataIndex: "DESCRIPTION",
      key: "DESCRIPTION",
      align: "center",
      responsive: ["lg"],
      render: (text: any, record: any, index: any) => {
        return (
          <Tag color="purple" >
            {text}
          </Tag>
          
        );
      },
    },
    {
      title: "Remark",
      dataIndex: "Remark",
      key: "Remark",
      align: "center",
      responsive: ["lg"],
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
      title: "Receive",
      children: [
        {
          title: "Tag Total",
          dataIndex: "Total_Tag",
          key: "Total_Tag",
          align: "center",
          render: (text: any, record: any, index: any) => {
            return <span style={{ color: "#108ee9" }}>{text}</span>;
            
          },
        },
        {
          title: "Lock",
          dataIndex: "Lock",
          key: "Lock",
          align: "center",
          render: (text: any, record: any, index: any) => {
            return <span style={{ color: "#CC0000" }}>{text}</span>;
            
          },
        },
        {
          title: "Unlock",
          dataIndex: "Unlock",
          key: "Unlock",
          align: "center",
          render: (text: any, record: any, index: any) => {
            return <span style={{ color: "#87d068" }}>{text}</span>;
            
          },
        },
      ],
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
            rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
            bordered
            size="small"
            // loading={isLoading}
            columns={columns_main as any}
            dataSource={reecivepartTable}
            pagination={{ pageSize: 50 }}
          />
        </Space>
        

        {/* -------------------------------------------------Modal Add Item----------------------------------------------------- */}
        <Modal
          title="Add Item"
          visible={isAdding}
          onOk={formAddItem.submit}
          onCancel={resetAdding}
          width={650}
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
              <Col span={9}>
                <Form.Item
                  name={['AddItem1', 'Grade']} 
                  label="Material"
                  rules={[{ required: true, message: "Please choose Material" }]}
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem1', 'Type']}
                  label="Type"  
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem1', 'Lot_No']}  
                  label="Lot No">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem1', 'QTY']} 
                  label="QTY"
                  rules={[{ required: true, message: "Please enter QTY" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name={['AddItem1', 'key']} hidden >
                <Input />
              </Form.Item>
                <Form.Item name={['AddItem1', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem1', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={9}>
                <Form.Item
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem2', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem2', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem2', 'QTY']} 
                  label=""
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name={['AddItem2', 'key']} hidden >
                <Input />
              </Form.Item>
                <Form.Item name={['AddItem2', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem2', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem3', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem3', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem3', 'QTY']} 
                  label=""
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name={['AddItem3', 'key']} hidden >
                <Input />
              </Form.Item>
                <Form.Item name={['AddItem3', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem3', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem4', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem4', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem4', 'QTY']} 
                  label=""
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name={['AddItem4', 'key']} hidden >
                <Input />
              </Form.Item>
                <Form.Item name={['AddItem4', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem4', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>    

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem5', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem5', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem5', 'QTY']} 
                  label=""
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name={['AddItem5', 'key']} hidden >
                <Input />
              </Form.Item>
                <Form.Item name={['AddItem5', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem5', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem6', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem6', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem6', 'QTY']} 
                  label=""
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name={['AddItem6', 'key']} hidden >
                <Input />
              </Form.Item>
                <Form.Item name={['AddItem6', 'Grade_ID']} hidden  >
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem6', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem7', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem7', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem7', 'QTY']} 
                  label=""
                >
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
                <Form.Item name={['AddItem7', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem7', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem8', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem8', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem8', 'QTY']} 
                  label=""
                >
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
                <Form.Item name={['AddItem8', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem8', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>  

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem9', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem9', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem9', 'QTY']} 
                  label=""
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name={['AddItem9', 'key']} hidden >
                <Input />
              </Form.Item>
                <Form.Item name={['AddItem9', 'Grade_ID']} hidden>
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem9', 'Grade_Name']} hidden >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={9}>
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
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={5}>
              <Form.Item 
                  name={['AddItem10', 'Type']}
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={6}>
                <Form.Item 
                  name={['AddItem10', 'Lot_No']}  
                  label="">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  name={['AddItem10', 'QTY']} 
                  label=""
                >
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
                <Form.Item name={['AddItem10', 'Grade_ID']} hidden >
                  <Input />
                </Form.Item>
                <Form.Item name={['AddItem10', 'Grade_Name']}  hidden>
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
          width={650}
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
              <Col span={9}>
                <Form.Item name="key" hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  name="Grade_ID"
                  label="Material (Part)"
                  rules={[
                    { required: true, message: "Please choose Material (Part)" },
                  ]}
                >
                  <Select
                    placeholder="Please choose Material (Part)"
                    onChange={(e) => gradeItemNameedit(e)}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option!.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {GradeItem?.data?.data
                    ?.filter(
                      (valueType: any) =>
                        valueType.Product_ID != 3
                    )
                    .map((value: any) => {
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
              <Col span={6}>
              <Form.Item 
                  name="Type" 
                  label="Type"
              >
                <Input style={{ background: "#f5f5f5" }} readOnly />
              </Form.Item>
            </Col>
              <Col span={5}>
                <Form.Item name="Lot_No" label="Lot No">
                  <Input />
                </Form.Item>
              </Col>
              
              <Col span={4}>
                <Form.Item
                  name="Item_Qty"
                  label="QTY"
                  rules={[{ required: true, message: "Please enter QTY" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    step="1"
                    min={1}
                    max={100000}
                  />
                </Form.Item>
                <Form.Item name="Grade_Id_Item" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="Grade_Name_Item" hidden>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          visible={visible}
          title="Receive Part"
          style={{ top: 20 }}
          onOk={formReceivePart.submit}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={formReceivePart.submit}
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
            form={formReceivePart}
            name="formReceivePart"
            onFinish={handleOk}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Card>
                <Form.Item name="Receive_Index" label="Receive_Index" hidden>
                  <Input />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="Receive_No" label="Receive No :">
                      <Input style={{ background: "#f5f5f5" }} readOnly />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="Receive_Date" label="Date :">
                      <DatePicker className="myDatePicker" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="Receive_Type" label="Job Type :">
                      <Input style={{ background: "#f5f5f5" }} readOnly />
                      
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="Ref_No1" label="Ref No1 (Request No.) :">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="Receive_Remark" label="Remark">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="Ref_No2" label="Material Doc :">
                      <Input />
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
                    onClick={onDeleteItem}
                    type="primary"
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
                          <Table.Summary.Cell
                            index={1}
                            colSpan={4}
                            align="right"
                          >
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
      </Template>
      ;
      {
        <FormTag
          visible={visibletag}
          handleCloseModelTag={handleCloseModelTag}
          tag={receivedetail}
        />
      }
    </>
  );
};

export default ReceivePart;
