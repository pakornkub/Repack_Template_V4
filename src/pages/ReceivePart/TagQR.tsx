import React, { useState, useEffect} from "react";
import { useSelector } from "react-redux";

import { setQR, selectQR } from "../../contexts/slices/qrSlice";
import {
  Table,
  Tag,
  Space,
  Button,
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
  PlusOutlined,
  PrinterOutlined,
  ClearOutlined,
  LoginOutlined
} from "@ant-design/icons";
import moment from "moment";
import { CloseOutlined } from "@ant-design/icons";
import {
  useReceiveStatus,
  useSelectTag,
  useCreateTag,
  useDeleteTag,
  useReceiveAuto
} from "../../hooks/useTag";
import {
  useReceivePartItem,
} from "../../hooks/useReceivePart";

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  Tag_ID: React.Key;
  QR_NO: string;
  Item_ID: string;
  ITEM_CODE: string;
  ITEM_DESCRIPTION: string;
  Lot_No: string;
  Qty: Number;
  Status_Item: string;
  Status_Tag: string;
  Product_ID:Number;
}
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const FormTag: React.FC<any> = ({ visible, handleCloseModelTag, tag }) => {
  const [formTagQR] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [displayPrint, setDisplayPrint] = useState(true);
  const [hiddenSeries, setHiddenSeries] = useState(true);
  const [hiddenReceiveAuto, setHiddenReceiveAuto] = useState(true);
  const [countTag, setCountTag] = useState(0);
  const qr = useSelector(selectQR);
  const { Option } = Select;

  const hasSelected = countTag > 0;

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);
  const [dataSourceVirtual, setDataSourceVirtual] = useState<DataType[]>([]);

  const [detailGradeLot, setGradeLot] = useState<any>([]);

  const {
    data: RCStatus,
    status: RCStatusStatus,
    error: RCStatusError,
    mutate: getReceiveStatus,
  } = useReceiveStatus();

  const {
    data: RCStatus1,
    status: RCStatusStatus1,
    error: RCStatusError1,
    mutate: getReceiveStatus1,
  } = useReceiveStatus();

  const {
    data: Tagdata,
    status: selectTagStatus,
    mutate: selectTag,
  } = useSelectTag();

  const {
    data: ReceivePartItem,
    error: createErrorReceivePartItem,
    status: getStatusReceivePartItem,
    mutate: getReceivePartItem,
  } = useReceivePartItem();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteTag();

  const {
    error: createError,
    status: createStatus, 
    mutate: createMutate,
  } = useCreateTag();

  const {
    error: ReceiveAutoError,
    status: ReceiveAutoStatus, 
    mutate: ReceiveAutoMutate,
  } = useReceiveAuto();

  useEffect(() => {
    formTagQR.resetFields();
    setCountTag(tag?.Total_Tag);
    formTagQR.setFieldsValue({
      Receive_Index: tag?.Rec_ID || null,
      Receive_No: tag?.Rec_NO || null,
      Receive_Date: moment(tag?.Rec_Datetime),
      Total_QTY: tag?.Sum_Qty || null,
    });
    selectTag(tag?.Rec_ID);
    
  }, [tag]);

  useEffect(() => {
    if (selectTagStatus === "success") {
      setDataSource(Tagdata?.data.data || []);

      if (!Tagdata?.data.data || Tagdata?.data.data.length <= 0) {
        setDisplayPrint(true);
        setHiddenReceiveAuto(true);
      }else{
        getReceivePartItem(tag?.Rec_ID);
        setDisplayPrint(false);
        if(tag?.status == 2 || (tag?.status == 1 && countTag > 0)){
          setHiddenReceiveAuto(false);
        }else{
          setHiddenReceiveAuto(true);
        }
        
        setDataSourcePrint(Tagdata?.data.data.filter(
        (valueType: any) => valueType.Product_ID !== 4 ) || []);
        setDataSourceVirtual(Tagdata?.data.data || []);
    
      }
    }
  }, [selectTagStatus]);

  useEffect(() => {
    if (getStatusReceivePartItem === "success") {
      
      setGradeLot(ReceivePartItem?.data.data || []);
      
    } else if (getStatusReceivePartItem === "error") {
      message.error(
        createErrorReceivePartItem?.response?.data?.message ||
          createErrorReceivePartItem.message
      );
    }
  }, [getStatusReceivePartItem]);




  useEffect(() => {
    formTagQR.setFieldsValue({
      QR_Code1: dataSource[0]?.QR_NO || [],
      QR_Code2: dataSource[tag?.Sum_Qty - 1]?.QR_NO || [],
    });
  });

  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Tag Success");
      selectTag(tag?.Rec_ID);
    } else if (createStatus === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Tag Success");
      selectTag(tag?.Rec_ID);
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  useEffect(() => {
    if (ReceiveAutoStatus === "success") {
      message.success("Receive Auto Success");
      refreshTag();
    } else if (ReceiveAutoStatus === "error") {
      message.error(
        ReceiveAutoError?.response?.data?.message || ReceiveAutoError.message
      );
    }
  }, [ReceiveAutoStatus]);

  

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "QR Code",
      dataIndex: "QR_NO",
      width: "10%",
      sorter: (a: any, b: any) => a.QR_NO.localeCompare(b.QR_NO),
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      width: "15%",
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "Material   Name",
      dataIndex: "ITEM_DESCRIPTION",
      width: "23%",
      sorter: (a: any, b: any) => a.ITEM_DESCRIPTION.localeCompare(b.ITEM_DESCRIPTION),
    },
    {
      title: "Lot No",
      dataIndex: "Lot_No",
      align: "center",
      width: "10%",
    },
    {
      title: "QTY",
      dataIndex: "Qty",
      align: "center",
      width: "7%",
    },
    {
      title: "Item Status",
      dataIndex: "Status_Item",
      align: "center",
      width: "8%",
      sorter: (a: any, b: any) => a.Status_Item.localeCompare(b.Status_Item),
      render: (text: any, color: any) => {
        if (text == "LOCK") {
          color = "red";
        } else if (text == "UNLOCK") {
          color = "green";
        } else {
          color = "#CC0000";
        }
        return <h1 style={{ color: color }}>{text}</h1>;
      },
    },
    {
      title: "Tag Status",
      dataIndex: "Status_Tag",
      align: "center",
      width: "8%",
      sorter: (a: any, b: any) => a.Status_Tag.localeCompare(b.Status_Tag),
      render: (text: any, color: any) => {
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
          <Tag color={color} style={{ textAlign: "center" }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "",
      dataIndex: "operation",
      align: "center",
      width: "5%",
      render: (_, record: any) => { 
          return (
            <>
              <button
                onClick={() => {
                  localStorage.setItem("qr", JSON.stringify(record));

                  window.open(
                    `${import.meta.env.VITE_APP_PUBLIC_URL}${"/QrCodePrint"}`
                  );
                }}
              >
                <PrinterOutlined />
              </button>
            </>
          );
      },
    },
  ];

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

  const onAddTagItem = (value: any) => {
    if (countTag > 0) {
      Modal.error({
        title: "Tag message",
        content: `Tag managed`,
      });
    } else if (!tag?.Sum_Qty) {
      Modal.error({
        title: "Tag message",
        content: `Must add items first`,
      });
    } else {
      createMutate(tag.Rec_NO);
      setCountTag(1);
    }
  };

  const onDeleteTagItem = () => {
    getReceiveStatus(tag.Rec_ID);
  };
  const refreshTag = () => {
    setDataSource([]);
    setDataSourcePrint([]);
    setDataSourceVirtual([]);
    setLoading(true);
    setTimeout(() => {
      selectTag(tag?.Rec_ID);
      setLoading(false);
    }, 300);
  };


  const onAddReceiveAuto = (value: any) => {
    
    if (countTag < 1) {
      Modal.error({
        title: "Receive message",
        content: `Must add Tag first`,
      });
    }else{
      getReceiveStatus1(tag.Rec_ID);
    }
  };
  
  // Receive Auto
  useEffect(() => {
    if (RCStatusStatus1 === "success") {
      if (RCStatus1?.data.data[0].status == 2) {
        ReceiveAutoMutate(tag.Rec_ID);
      } else {
        Modal.error({
          title: "Receive message",
          content: `Can't Receive because received`,
        });
        
      }
    } else if (RCStatusStatus1 === "error") {
      message.error(
        RCStatusError1?.response?.data?.message || RCStatusError1.message
      );
    }
  }, [RCStatusStatus1]);



  useEffect(() => {
    if (RCStatusStatus === "success") {
      if (RCStatus?.data.data[0].status > 2) {
        Modal.error({
          title: "Tag message",
          content: `Can't clear tag`,
        });
      } else {
        Modal.confirm({
          title: "Delete Confirm",
          content: (
            <>{`Do you want delete Tag of Receive No : ${tag.Rec_NO} ?`}</>
          ),
          onOk: () => {
            deleteMutate(tag.Rec_ID);
            setCountTag(0);
          },
        });
      }
    } else if (RCStatusStatus === "error") {
      message.error(
        RCStatusError?.response?.data?.message || RCStatusError.message
      );
    }
  }, [RCStatusStatus]);

  

  const selectGradeLot = (value: any) => {
    
    let _dataSource = [...dataSourceVirtual];

    if(value == undefined){
      setDataSourcePrint(_dataSource.filter((valueType: any) =>  valueType.Product_ID !== 4 ));
      setHiddenSeries(true);
      
    }else{
      const detail = value.split("|");
      let grade = detail[0];
      let lot = detail[1];
      let type = detail[2];

      if (lot == 'null'){
        lot = null;
      }

      if(type == 'Semi Product'){
        setDataSourcePrint([]);
        _dataSource = _dataSource.filter((item) => item.ITEM_CODE === grade && item.Lot_No === lot);
        
        let dataSourceSemi = [];

        for(let i = 0;i<_dataSource.length;i++){
            const new_value1 = {
            QR_NO:      _dataSource[i].QR_NO,
            ITEM_CODE:  _dataSource[i].ITEM_CODE,
            Tag_ID:     _dataSource[i].Tag_ID,
            Item_ID:    _dataSource[i].Item_ID,
            Lot_No:     _dataSource[i].Lot_No,
            Product_ID: _dataSource[i].Product_ID,
            Series:     "BOX",
          };
          dataSourceSemi.push(new_value1);
        }
        setDataSourcePrint(dataSourceSemi);
        setHiddenSeries(false);
        
        formTagQR.setFieldsValue({
          Series: "BOX",
        });

      }else{
        _dataSource = _dataSource.filter((item) => item.ITEM_CODE === grade && item.Lot_No === lot);
        setDataSourcePrint(_dataSource);
        setHiddenSeries(true);
      }
      
    }
    
  };

  const selectSemiSeries = (value: any) => {
    
    let _dataSource = [...dataSourcePrint];

    
    _dataSource.forEach((element, index) => {
      _dataSource[index]["Series"] = value;
    });

    setDataSourcePrint(_dataSource);
  };


  return (
    <>
      <Modal
        visible={visible}
        title="Tag"
        style={{ top: 20 }}
        onCancel={handleCloseModelTag}
        width={1200}
        footer={[
            
            <Row gutter={16}>
              <Col span={12} style={{textAlign:'left'}} >
                <div hidden={hiddenReceiveAuto}>
                  <Button
                    type="primary"
                    className="btn-info"
                    style={{
                      marginLeft: 8,
                      marginBottom: 8
                    }}
                    onClick={onAddReceiveAuto}
                    icon={<LoginOutlined className="relative bottom-[0.2em]" />}
                  >
                    Receive
                  </Button>
                </div>
                
              </Col>
              <Col span={12}>
                <Button
                key="back"
                type="ghost"
                danger
                onClick={handleCloseModelTag}
                icon={<CloseOutlined  className="relative bottom-[0.2em]" />}
              >
                Close
              </Button>
              </Col>
            </Row>

          
        ]}
      >
        <Form layout="vertical" form={formTagQR} name="formTagQR">
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card>
              <Form.Item name="Receive_Index" label="Receive_Index" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16} style={{marginTop:-15}}>
                <Col span={5}>
                  <Form.Item name="Receive_No" label="Receive No :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="Receive_Date" label="Date :">
                    <DatePicker className="myDatePicker" disabled style={{ background: "#f5f5f5"}}/>
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="Total_QTY" label="Total QTY :">
                    <Input style={{ textAlign: "right",background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                
              </Row>

              {/* ------------print-------------- */}
              <Card hidden={displayPrint} style={{marginTop:-10,marginBottom:-10}}>
              <Row gutter={16} style={{marginTop:-15,marginBottom:-35}}>
                <Col span={4}>
                  <Form.Item name="QR_Code1" label="QR Code Start :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="QR_Code2" label="QR Code End :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name="GradeLot"
                    label="Material / Lot No :"
                  >
                    <Select
                      placeholder="Please choose Material / Lot No"
                      onChange={(e) => selectGradeLot(e)}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      allowClear
                    >
                      {detailGradeLot?.map((value: any) => {
                        return (
                          <Option
                          key={value.Grade_Name +'|'+ value.Lot_No +'|'+ value.Type}
                          value={value.Grade_Name +'|'+ value.Lot_No +'|'+ value.Type}
                          >
                            {value.Grade_Name +' Lot No: '+ value.Lot_No}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3} hidden={hiddenSeries}>
                  <Form.Item
                    name="Series"
                    label="Series :"
                  >
                    <Select
                      onChange={(e) => selectSemiSeries(e)}
                      placeholder="Please choose Series">
                      <Option value="BOX" >BOX</Option>
                      <Option value="WARE">WARE</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item label=" ">
                    <Button
                      type="primary"
                      className="btn-info"
                      style={{
                        marginBottom: 16,
                      }}
                      onClick={() => {
                        localStorage.setItem("qr", JSON.stringify(dataSourcePrint));

                        window.open(
                          `${
                            import.meta.env.VITE_APP_PUBLIC_URL
                          }${"/QrCodePrintAll"}`
                        );
                      }}
                    >
                      <PrinterOutlined />
                      Print
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              </Card>
            </Card>

            <Card>
              <div>
                <Table
                  bordered
                  dataSource={dataSource}
                  rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                  columns={columns as ColumnTypes}
                  pagination={false}
                  scroll={{ y: 400 }}
                  footer={() => (
                    <div>
                      {"Total Tag : "}
                      {dataSource.length}
                    </div>
                  )}
                />

                <Row gutter={16}>
                  <Col>
                    <Button
                      onClick={onAddTagItem}
                      type="primary"
                      className="btn-success"
                      style={{
                        marginTop: 16,
                      }}
                      icon={<PlusOutlined className="relative bottom-[0.2em]" />}
                    >
                      Add
                    </Button>
                    <Button
                      type="primary"
                      onClick={onDeleteTagItem}
                      className="btn-warning"
                      style={{
                        marginLeft: 8,
                        marginBottom: 16,
                      }}
                      icon={<ClearOutlined className="relative bottom-[0.2em]" />}
                      disabled={!hasSelected}
                    >
                      Clear
                    </Button>
                  </Col>
                  <Col className="flex justify-end items-center" flex={1}>
                    <Button
                      type="primary"
                      onClick={() => {
                        refreshTag();
                      }}
                      style={{
                        marginLeft: 8,
                        marginBottom: 16,
                        background: "#7eaff6",
                        borderColor: "#2e7cee",
                      }}
                      // icon={<LoadingOutlined className="relative bottom-[0.2em]" />}
                      loading={loading}
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
    </>
  );
};

export default FormTag;
