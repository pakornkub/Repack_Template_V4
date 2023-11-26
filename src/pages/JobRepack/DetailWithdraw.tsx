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
  DatePicker,
  Card,
} from "antd";
import {PrinterOutlined} from "@ant-design/icons";
import moment from "moment";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

import {
  useSelectQRBox,
  useSelectWithdrawItem,
} from "../../hooks/useJobRepack";

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  Tag_ID: React.Key;
  QR_NO: string;
  Item_No: string;
  ITEM_DESCRIPTION: string;
  Lot_No: string;
  Qty: Number;
  Status_Item: string;
  Status_Tag: string;
}
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const FormDetail: React.FC<any> = ({ visible, handleCloseDrawer, tag }) => {
  const [FormDetailQR] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countTag, setCountTag] = useState(0);
  const qr = useSelector(selectQR);
  const [dataQRBox, setDataQRBox] = useState<any>([]);
  const [dataWithdrawItem, setDataWithdrawItem] = useState<DataType[]>([]);

  const {
    data: selectQRBoxDate,
    status: selectQRBoxStatus,
    mutate: selectQRBox,
  } = useSelectQRBox();

  const {
    data: selectWithdrawItemData,
    status: selectWithdrawItemStatus,
    mutate: selectWithdrawItem,
  } = useSelectWithdrawItem();

  useEffect(() => {
    FormDetailQR.resetFields();
    setCountTag(tag?.Total_Tag);
    FormDetailQR.setFieldsValue({
      Job_Index: tag?.JOB_ID || null,
      Job_No: tag?.JOB_No || null,
      Job_Date: moment(tag?.JOB_Datetime),
      QTY_BOX: tag?.JOB_QTY || null,
      Total_QTY: tag?.JOB_Total_QTY || null,
    });
    selectQRBox(tag?.JOB_ID);
    selectWithdrawItem(tag?.JOB_ID);
  }, [tag]);

  useEffect(() => {
    if (selectQRBoxStatus === "success") {
      setDataQRBox(selectQRBoxDate?.data.data || []);
    }
  }, [selectQRBoxStatus]);

  useEffect(() => {
    FormDetailQR.setFieldsValue({
      QR_Code1: dataQRBox[0]?.QR_NO || [],
      QR_Code2: dataQRBox[tag?.JOB_QTY - 1]?.QR_NO || [],
    });
  });

  useEffect(() => {
    if (selectWithdrawItemStatus === "success") {
      setDataWithdrawItem(selectWithdrawItemData?.data.data || []);
    }
  }, [selectWithdrawItemData]);

  const refreshTag = () => {
    setDataWithdrawItem([]);
    setLoading(true);
    setTimeout(() => {
      selectWithdrawItem(tag?.JOB_ID);
      setLoading(false);
    }, 300);
  };


  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "QR Code",
      dataIndex: "QR_NO",
      width: "10%",
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      width: "15%",
    },
    {
      title: "Material Name",
      dataIndex: "ITEM_DESCRIPTION",
      width: "23%",
    },
    {
      title: "QTY",
      dataIndex: "Qty",
      align: "center",
      width: "5%",
    },
    {
      title: "Item Status",
      dataIndex: "Status_desc",
      align: "center",
      width: "8%",
      sorter: (a: any, b: any) => a.Status_desc - b.Status_desc,
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
      title: "Scan By",
      dataIndex: "Create_By",
      align: "center",
      width: "8%",
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

  return (
    <>
      <Modal
        visible={visible}
        title="View Withdraw"
        style={{ top: 20 }}
        onCancel={handleCloseDrawer}
        width={1200}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={handleCloseDrawer}
            style={{ background: "red", borderColor: "red" }}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Close
          </Button>,
        ]}
      >
        <Form layout="vertical" form={FormDetailQR} name="FormDetailQR">
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card>
              <Form.Item name="Job_Index" label="Job_Index" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={5}>
                  <Form.Item name="Job_No" label="Job No :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="Job_Date" label="Date :">
                    <DatePicker className="myDatePicker" disabled />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name="QTY_BOX" label="QTY BOX :">
                    <Input style={{ textAlign: "right",background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item name="Total_QTY" label="Total QTY :">
                    <Input style={{ textAlign: "right",background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="QR_Code1" label="QR Box Start:">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="QR_Code2" label="QR Box End:">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
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
                        localStorage.setItem("qr", JSON.stringify(dataQRBox));

                        window.open(
                          `${
                            import.meta.env.VITE_APP_PUBLIC_URL
                          }${"/QrBoxPrintAll"}`
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

            <Card>
              <div>
                <Table
                  bordered
                  dataSource={dataWithdrawItem}
                  columns={columns as ColumnTypes}
                  pagination={false}
                  scroll={{ y: 400 }}
                  footer={() => (
                    <div>
                      <div>
                        {"Total Withdraw Item : "}
                        {dataWithdrawItem.length}
                      </div>
                    </div>
                  )}
                />
                <Row gutter={16} style={{ marginTop: 8 }}>
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

export default FormDetail;
