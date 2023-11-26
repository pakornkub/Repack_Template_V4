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
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useJobRepack,
  useDeleteJobRepack,
  useCreateJobRepack,
  useUpdateJobRepack,
  useJobRepackItem,
} from "../../hooks/useJobRepack";
import { useReceiveType } from "../../hooks/useReceiveType";
import { useJobType } from "../../hooks/useJobType";
import { useJobNo } from "../../hooks/useJobNo";
import { useGrade } from "../../hooks/useGrade";
import { useGradeSP } from "../../hooks/useGradeSP";
import {
  useBomForJob,
  useGradePlan,
  useBomRev,
  useBomItem,
} from "../../hooks/useBomForJob";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/lib/form";
import { useSelector } from "react-redux";
import { selectAuth } from "../../contexts/slices/authSlice";
import Template from "../../components/Template2";
import FormDetail from "./DetailWithdraw";
import "./JobRepack.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  Grade_ID: Number;
  Grade_Name: string;
  Lot_No: string;
  Type: string;
  QTY: Number;
  ToTal_Use: Number;
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
  ToTal_Use: Number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const JobRepack: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [disabledBomRev, setDisabledBomRev] = useState(false);
  const [visibletag, setVisibleTag] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [buttonAddS, setButtonAddS] = useState(true);
  const [showBomRev, setShowBomRev] = useState(false);

  const [buttonSubmit, setButtonSubmit] = useState(false);

  const [JobRepackTable, setJobRepackTable] = useState<any>([]);
  const [gradeDes, setGrade] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [bomRevName, setBomRev] = useState<any>([]);
  const [formJobRepack] = Form.useForm();
  const [formEditItem] = Form.useForm();
  const [formAddItem] = Form.useForm();
  const { Option } = Select;
  const [jobDetail, setViewJob] = useState<any>({});
  const [JobDoc, setJob] = useState(null);
  const [jobTypeID, setType] = useState(null);
  const [jobDate, setDate] = useState(null);
  const [totalQty, setTotalQty] = useState<any>(0);
  const [totalUseQty, setTotalUseQty] = useState<any>(0);
  const [useQty, setUseQty] = useState<any>(0);
  const [count, setCount] = useState(2);

  const {
    data: JobRepackItem,
    error: createErrorJobRepackItem,
    status: getStatusJobRepackItem,
    mutate: getJobRepackItem,
  } = useJobRepackItem();

  const {
    isFetching,
    data: JobRepackdata,
  } = useJobRepack();

  const {
    error: createErrorJobRepack,
    status: createStatusJobRepack,
    mutate: createMutateJobRepack,
  } = useCreateJobRepack();

  const {
    error: updateErrorJobRepack,
    status: updateStatusJobRepack,
    mutate: updateMutateJobRepack,
  } = useUpdateJobRepack();

  const {
    data: JobNo,
    status: JobStatus,
    error: JobError,
    mutate: getJobNo,
  } = useJobNo();

  const {
    data: JobType,
  } = useJobType();

  const {
    data: GradePlan,
    status: GradePlanStatus,
    error: GradePlanError,
    mutate: getGradePlan,
  } = useGradePlan();


  const {
    data: GradeSP,
  } = useGradeSP();

  const {
    data: BomForJob,
  } = useBomForJob();

  const {
    data: BomRev,
    status: BomRevStatus,
    error: BomRevError,
    mutate: getBomRev,
  } = useBomRev();

  const {
    data: BomItem,
    status: BomItemStatus,
    error: BomItemError,
    mutate: getBomItem,
  } = useBomItem();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteJobRepack();

  const handleShowDrawer = () => {
    setVisibleTag(true);
  };

  const handleCloseDrawer = () => {
    setVisibleTag(false);
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
      <Menu.Item key="2" icon={<SnippetsOutlined />}>
        View Withdraw
      </Menu.Item>
      <Menu.Item key="3" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        setViewJob({ ...record, event: e.key });
        getJobRepackItem(record.JOB_ID);
        showModal("Edit");

        break;
      case "2":
        setViewJob({ ...record, event: e.key });
        handleShowDrawer();
        // setGroup({ ...record, event: e.key });
        break;
      case "3":
        if (record.JOB_STATUS > 2) {
          Modal.error({
            title: "Message",
            content: `Can't delete job No : ${record.JOB_No}`,
          });
        } else {
          Modal.confirm({
            title: "Delete Confirm",
            content: <>{`Do you want delete Job No : ${record.JOB_No} ?`}</>,
            onOk: () => {
              deleteMutate(record.JOB_ID);
            },
          });
        }

        break;
    }
  };

  useEffect(() => {
    if (getStatusJobRepackItem === "success") {
      setDataSource(JobRepackItem?.data.data || []);

      const initialValue = 0;
      if (!JobRepackItem?.data || JobRepackItem.data.length <= 0) {
        setTotalQty(0);
        setTotalUseQty(0);
      } else {
        const sumWithInitial = JobRepackItem?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.QTY),
          initialValue
        );
        const sumWithInitial1 = JobRepackItem?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.ToTal_Use),
          initialValue
        );
        setTotalQty(sumWithInitial);
        setTotalUseQty(sumWithInitial1);
      }
    } else if (getStatusJobRepackItem === "error") {
      message.error(
        createErrorJobRepackItem?.response?.data?.message ||
          createErrorJobRepackItem.message
      );
    }
  }, [getStatusJobRepackItem]);

  const handleCancel = () => {
    setVisible(false);
    formJobRepack.resetFields();
    setDataSource([]);
    setType(null);
    setBomRev([]);
    setDate(null);
    setButtonAddS(true);
    setShowBomRev(false)
    setTotalQty(0);
    setTotalUseQty(0);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const JobRepackDataSearch = JobRepackdata?.data.data.filter(
        (value: any) => {
          return Object.keys(value).some((key: any) =>
            String(value[key])
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          );
        }
      );
      setJobRepackTable(JobRepackDataSearch);
    } else {
      setJobRepackTable(JobRepackdata?.data.data || []);
    }
  };

  useEffect(() => {
    setJobRepackTable(JobRepackdata?.data.data || []);
  }, [isFetching]);

  useEffect(() => {
    formJobRepack.resetFields();

    formJobRepack.setFieldsValue({
      Job_Index: jobDetail?.JOB_ID || null,
      Job_No: jobDetail?.JOB_No || null,
      Job_Type: jobDetail?.JobType_ID,
      Job_Date: moment(jobDetail?.JOB_Date),
      Bom_ID: jobDetail?.BOM_ID || null,
      Grade_FG: jobDetail?.ITEM_CODE || null,
      Grade_ID_FG: jobDetail?.ITEM_ID || null,
      QTY_Use: jobDetail?.JOB_QTY || null,
      Lot_No: jobDetail?.FG_LOT_NO || null,
      BomRev_Name: jobDetail?.BOM_Name || null,
    });
    setType(jobDetail?.JobType_ID);
    if (jobDetail?.JobType_ID == "2") {
      //Repack
      formJobRepack.setFieldsValue({
        BomRev_Name: jobDetail?.ITEM_CODE || null,
      });
      setShowBomRev(true);
    } else {
      formJobRepack.setFieldsValue({
        BomRev_Name: jobDetail?.BOM_Name || null,
      });
    }
  }, [jobDetail]);

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "Material",
      dataIndex: "Grade_Name",
      width: "35%",
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
      align: "center",
      // editable: true,
    },
    {
      title: "ToTal Use",
      dataIndex: "ToTal_Use",
      align: "center",
      // editable: true,
    },
    {
      title: "",
      dataIndex: "operation",
      align: "center",
      render: (_, record: any) => {
        if(jobTypeID == '2' && buttonAddS == false){
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

  const calTotalQty = (value: any) => {
    setUseQty(value);

    let b = dataSource.map((v, index) => {
      return { ...v, ToTal_Use: Number(v.QTY) * value };
    });

    setDataSource([]);
    setDataSource(b);

    const initialValue = 0;
    const sumWithInitial1 = b.reduce(
      (previousValue: any, currentValue: any) =>
        previousValue + Number(currentValue.ToTal_Use),
      initialValue
    );
    setTotalUseQty(sumWithInitial1);
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

  // const { mutate: deleteMutate } = useDeleteGrade();

  const showModal = (value: any) => {

    if (value == "Add") {
      setDisabled(false);
      setDisabledBomRev(false);
      setButtonSubmit(false);
    } else {
      setDisabled(true);
      setDisabledBomRev(true);
      setButtonSubmit(true);
    }
    setVisible(true);
    formJobRepack.resetFields();
    setGrade(BomForJob?.data?.data);
  };

  const handleOk = (value: any) => {
    const newData = [...dataSource];
    const totalUseQTY = { totalUseQty: totalUseQty };
    if (value?.Job_Index) {
      updateMutateJobRepack({ data: value, data2: newData });
    } else {
      createMutateJobRepack({
        data: value,
        data2: newData,
        data3: totalUseQTY,
      });
    }
  };

  useEffect(() => {
    if (createStatusJobRepack === "success") {
      message.success("Add Receive Part Success");
      handleCancel();
    } else if (createStatusJobRepack === "error") {
      message.error(
        createErrorJobRepack?.response?.data?.message ||
          createErrorJobRepack.message
      );
    }
  }, [createStatusJobRepack]);

  useEffect(() => {
    if (updateStatusJobRepack === "success") {
      message.success("Update JobRepack Success");
    } else if (updateStatusJobRepack === "error") {
      message.error(
        updateErrorJobRepack?.response?.data?.message ||
          updateErrorJobRepack.message
      );
    }
  }, [updateStatusJobRepack]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Receive Part Success");
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  const setJobNo = (value: any) => {
    setBomRev([]);
    setDataSource([]);
    setButtonAddS(true);
    setShowBomRev(false);
    setTotalQty(0);
    setTotalUseQty(0);
    formJobRepack.setFieldsValue({
      BomRev_Name: null,
      Grade_FG: null,
      Bom_ID: null,
      Grade_ID_FG: null,
      QTY_Use: null,
    });

    if (value) {
      setGrade([]);
      getJobNo(value);
      setType(value);

      if (value == "3") {
        getGradePlan(jobDate);
      } else {
        setGrade(BomForJob?.data?.data);
      }
    }
  };

  const handleDatePickerChange = (date: any, dateString: any) => {
    setDate(dateString);

    if (jobTypeID == "3") {
      //plan
      getGradePlan(dateString);
      setGrade([]);
    }
  };

  const setBom = (value: any) => {
    setBomRev([]);
    setDataSource([]);
    setTotalQty(0);
    setTotalUseQty(0);

    const Grade = value.split("|");
    setUseQty(Grade[2]);

    formJobRepack.setFieldsValue({
      BomRev_Name: null,
      Grade_ID_FG: Grade[0] || null,
      Type: Grade[3],
      QTY_Use: Grade[2],
    });

    if (jobTypeID == "2") {
      //Recheck
      const BomRevRecheck = [{ BOM_ID: 0, BOM_Name: Grade[1] }];
      setBomRev(BomRevRecheck || []);
      setDisabledBomRev(true);
      formJobRepack.setFieldsValue({
        BomRev_Name: BomRevRecheck[0].BOM_Name || null,
      });

      const BomItemRecheck = [
        {
          key: 1,
          Grade_ID: Grade[0],
          Grade_Name: Grade[1],
          Type: Grade[3],
          QTY: 1,
          ToTal_Use: 0,
        },
      ];
      setDataSource(BomItemRecheck || []);
      setButtonAddS(false);
      setShowBomRev(true);
      setTotalQty(1);
    } else {
      setDisabledBomRev(false);
      setButtonAddS(true);
      setShowBomRev(false);
      if (value) {
        getBomRev(Grade[0]);
      }
    }
  };

  const setBomItem = (value: any) => {
    const Bom = value.split("|");

    formJobRepack.setFieldsValue({
      Bom_ID: Bom[0] || null,
    });

    if (value) {
      getBomItem(Bom[0]);
    }
  };

  useEffect(() => {
    if (GradePlanStatus === "success") {
      setGrade(GradePlan?.data.data);
    } else if (GradePlanStatus === "error") {
      message.error(
        GradePlanError?.response?.data?.message || GradePlanError.message
      );
    }
  }, [GradePlanStatus]);

  useEffect(() => {
    if (BomRevStatus === "success") {
      setBomRev(BomRev?.data?.data || []);

      if (!BomRev?.data?.data || BomRev?.data?.data.length <= 0) {
        // console.log("No Data");
      } else {
        formJobRepack.setFieldsValue({
          BomRev_Name: BomRev?.data?.data[0].BOM_Name || null,
        });
        let text =
          BomRev?.data?.data[0].BOM_ID + "|" + BomRev?.data?.data[0].BOM_Name;
        setBomItem(text);
      }
    } else if (BomRevStatus === "error") {
      message.error(
        BomRevError?.response?.data?.message || BomRevError.message
      );
    }
  }, [BomRevStatus]);

  useEffect(() => {
    if (BomItemStatus === "success") {
      setDataSource(BomItem?.data.data || []);
      const initialValue = 0;
      if (!BomItem?.data || BomItem.data.length <= 0) {
        setTotalQty(0);
        setTotalUseQty(0);
      } else {
        let b = BomItem?.data.data.map((v: any, index: any) => {
          return { ...v, ToTal_Use: Number(v.QTY) * useQty };
        });

        setDataSource([]);
        setDataSource(b);

        const sumWithInitial = BomItem?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.QTY),
          initialValue
        );

        const sumWithInitial1 = b.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.ToTal_Use),
          initialValue
        );
        setTotalQty(sumWithInitial);
        setTotalUseQty(sumWithInitial1);
      }
    } else if (BomItemStatus === "error") {
      message.error(
        BomItemError?.response?.data?.message || BomItemError.message
      );
    }
  }, [BomItemStatus]);

  useEffect(() => {
    if (JobStatus === "success") {
      setJob(JobNo?.data.data[0].JobNo);

      formJobRepack.setFieldsValue({
        // Grade_ID_FG: value || null
        Job_No: JobNo?.data.data[0].jobNo || null,
      });
    } else if (JobStatus === "error") {
      message.error(JobError?.response?.data?.message || JobError.message);
    }
  }, [JobStatus]);

  const gradeItemName = (value: any) => {

    if(value != undefined){
      const Grade = value.split("|");

      formAddItem.setFieldsValue({
        Grade_Id_SP: Number(Grade[0]),
        Grade_Name_SP: Grade[1],
        Type:Grade[2],
      });
    }else{
      formAddItem.setFieldsValue({
        Grade_Id_SP: null,
        Grade_Name_SP: null,
        Type:null,
      });
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

  const onAddItem = (record: any) => {
    setIsAdding(true);
    // setAddingItem({ ...record });
  };

  const resetAdding = () => {
    setIsAdding(false);
    formAddItem.resetFields();
  };

  const handleSaveAddItem = (value: any) => {
    let _dataSource = [...dataSource];
    const search = (obj:any) => obj.Grade_ID === value.Grade_Id_SP
    const indexFind = _dataSource.findIndex(search);       

    if (indexFind === -1) { //ไม่ซ้ำ
      const newData: DataType = {
        key: count,
        Grade_ID: value.Grade_Id_SP,
        Grade_Name: value.Grade_Name_SP,
        Type: value.Type,
        QTY: value.Item_Qty,
        ToTal_Use: value.Item_Qty * useQty || 0,
      };
      setDataSource([...dataSource, newData]);
      setCount(count + 1);

      resetAdding();
      setTotalQty(totalQty + value.Item_Qty);
      setTotalUseQty(totalUseQty + (value.Item_Qty * useQty));
    }else{ //ซ้ำ
      message.error(
        `Can't save due to duplicate the material code`
      );
    
  }
      
      
    
  };

  const onEditItem = (record: any) => {
    setIsEditing(true);
    // setEditingItem({ ...record });
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
    // setEditingItem(null);
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
        ToTal_Use: value.Item_Qty * useQty || 0,
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

      const initialValue1 = 0;
      const sumWithInitial1 = newData.reduce(
        (previousValue: any, currentValue: any) =>
          previousValue + Number(currentValue.ToTal_Use),
        initialValue1
      );
      setTotalUseQty(sumWithInitial1);
    }else{ //ซ้ำ
      message.error(
        `Can't edit due to duplicate the material code`
      );
      
    }
  };

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

    const initialValue1 = 0;
    const sumWithInitial1 = newData.reduce(
      (previousValue: any, currentValue: any) =>
        previousValue + Number(currentValue.ToTal_Use),
      initialValue1
    );
    setTotalUseQty(sumWithInitial1);
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
      title: "Job No",
      dataIndex: "JOB_No",
      key: "JOB_No",
      align: "center",
      sorter: (a: any, b: any) => a.JOB_No.localeCompare(b.JOB_No),
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
      dataIndex: "JobType_desc",
      key: "JobType_desc",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.JobType_desc.localeCompare(b.JobType_desc),
      render: (text: any, record: any, index: any, color: any) => {
        if (text == "Create") {
          color = "purple";
        } else if (text == "Recheck") {
          color = "cyan";
        } else if (text == "Plan") {
          color = "orange";
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
      title: "Material",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "QTY",
      dataIndex: "JOB_QTY",
      key: "JOB_QTY",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.JOB_QTY.localeCompare(b.JOB_QTY),
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
                onClick={() => {
                  showModal("Add");
                }}
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
            dataSource={JobRepackTable}
            pagination={{ pageSize: 50 }}
          />
        </Space>

        <Modal
          visible={visible}
          title="Job Repack"
          style={{ top: 20 }}
          onOk={formJobRepack.submit}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={formJobRepack.submit}
              icon={<SaveOutlined className="relative bottom-[0.2em]" />}
              hidden={buttonSubmit}
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
            form={formJobRepack}
            name="formJobRepack"
            onFinish={handleOk}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Card>
                <Form.Item name="Job_Index" label="Job_Index" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="Grade_ID_FG" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="Bom_ID" hidden>
                  <Input />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="Job_No" label="Job No :">
                      <Input style={{ background: "#f5f5f5" }} disabled={disabled} readOnly/>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Job_Type"
                      label="Job Type :"
                      rules={[
                        { required: true, message: "Please choose Job Type" },
                      ]}
                    >
                      <Select
                        placeholder="Please choose Job Type"
                        onChange={(e) => setJobNo(e)}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option!.children as unknown as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        allowClear
                        disabled={disabled}
                      >
                        {JobType?.data?.data?.map((value: any) => {
                          return (
                            <Option
                              key={value.JobType_desc}
                              value={value.JobType_ID}
                            >
                              {value.JobType_desc}
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
                      name="Job_Date"
                      label="Date :"
                      rules={[
                        { required: true, message: "Please select Date" },
                      ]}
                    >
                      <DatePicker
                        className="myDatePicker"
                        onChange={(date, dateString) =>
                          handleDatePickerChange(date, dateString)
                        }
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="Grade_FG"
                      label="Material (FG) :"
                      rules={[
                        { required: true, message: "Please choose Material (FG)" },
                      ]}
                    >
                      <Select
                        placeholder="Please choose Material (FG)"
                        onChange={(e) => setBom(e)}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option!.children as unknown as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        allowClear
                        disabled={disabled}
                      >
                        {gradeDes?.map((value: any) => {
                          return (
                            <Option
                              key={value.ITEM_CODE}
                              value={
                                value.ITEM_ID +
                                "|" +
                                value.ITEM_CODE +
                                "|" +
                                value.QTY +
                                "|" +
                                value.Product_DESCRIPTION
                              }
                            >
                              {value.ITEM_CODE}
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
                      name="QTY_Use"
                      label="QTY :"
                      rules={[{ required: true, message: "Please enter QTY" }]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        step="1"
                        min={1}
                        max={1000}
                        onChange={(event) => calTotalQty(event)}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="Lot_No" label="Lot No :">
                      <Input disabled={disabled}/>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card>
                <div>
                  <table style={{marginTop:-8,marginBottom:-8}} hidden={showBomRev}>
                    <tr>
                      <div>
                      <td>
                        <Form.Item>BOM :</Form.Item>
                      </td>
                      <td>
                        <Form.Item
                          name="BomRev_Name"
                          rules={[
                            { required: true, message: "Please choose BOM ID" },
                          ]}
                        >
                          <Select
                            placeholder="Please choose BOM"
                            onChange={(e) => setBomItem(e)}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option!.children as unknown as string)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                            allowClear
                            disabled={disabledBomRev}
                          >
                            {bomRevName?.map((value: any) => {
                              return (
                                <Option
                                  key={value.BOM_Name}
                                  value={value.BOM_ID + "|" + value.BOM_Name}
                                >
                                  {value.BOM_Name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </td>
                      </div>
                    </tr>
                  </table>

                  <Table
                    components={components}
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                    bordered
                    dataSource={dataSource}
                    columns={columns as ColumnTypes}
                    pagination={false}
                    summary={() => (
                      <Table.Summary>
                        <Table.Summary.Row>
                          <Table.Summary.Cell
                            index={1}
                            colSpan={2}
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
                          <Table.Summary.Cell
                            index={3}
                            colSpan={1}
                            align="center"
                          >
                            {totalUseQty}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell
                            index={4}
                            colSpan={1}
                            align="center"
                          >
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                  
                  <table style={{marginTop:8,marginBottom:-8}} hidden={buttonAddS}>
                    <tr>
                      <div>
                        <td>
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
                        </td>
                      </div>
                    </tr>
                  </table>
                </div>
              </Card>
            </Space>
          </Form>
        </Modal>
      </Template>
      ;
      {
        <FormDetail
          visible={visibletag}
          handleCloseDrawer={handleCloseDrawer}
          tag={jobDetail}
        />
      }

      {/* -------------------------------------------------------------------------------------------------------- */}
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
                name="Grade_Id"
                label="Material"
                rules={[
                  { required: true, message: "Please choose Material" },
                ]}
              >
                <Select
                  placeholder="Please choose Material"
                  onChange={(e) => gradeItemName(e)}
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
                ]}>
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

              <Form.Item name="Grade_ID_FG" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="Bom_ID" hidden>
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

    </>
  );
};

export default JobRepack;
