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
  message,
  DatePicker,
  Card,
} from "antd";

import moment from "moment";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useReceiveStatusReturn,
  useSelectTagReturn,
  useDeleteTagReturn,
  useCreateTagReturn,
} from "../../hooks/useTagReturn";


type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  Tag_ID: React.Key;
  QR_NO: string;
  ITEM_CODE: string;
  ITEM_DESCRIPTION: string;
  Lot_No: string;
  Qty: Number;
  Status_Item: string;
  Status_Tag: string;
}
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const FormTag: React.FC<any> = ({ visible, handleCloseDrawer, tag }) => {
  const [formTagQR] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [countTag, setCountTag] = useState(0);

  const qr = useSelector(selectQR);

  const {
    data: RCStatus,
    status: RCStatusStatus,
    error: RCStatusError,
    mutate: getReceiveStatus,
  } = useReceiveStatusReturn();

  const {
    data: Tagdata,
    status: selectTagStatus,
    mutate: selectTag,
  } = useSelectTagReturn();

  const {
    error: createErrorReturn,
    status: createStatusReturn,
    mutate: createTagReturn,
  } = useCreateTagReturn();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteTagReturn();

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
    }
  }, [selectTagStatus]);

  useEffect(() => {
    formTagQR.setFieldsValue({
      QR_Code1: dataSource[0]?.QR_NO || [],
      QR_Code2: dataSource[tag?.Sum_Qty - 1]?.QR_NO || [],
    });
  });

  useEffect(() => {
    if (createStatusReturn === "success") {
      message.success("Add Tag Success");
      selectTag(tag?.Rec_ID);
    } else if (createStatusReturn === "error") {
      message.error(
        createErrorReturn?.response?.data?.message || createErrorReturn.message
      );
    }
  }, [createStatusReturn]);

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
    // console.log(qr);
  }, [qr]);

  const hasSelected = countTag > 0;

  const [dataSource, setDataSource] = useState<DataType[]>([]);

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
      title: "Material Name",
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
          } else if (text == "UNLOCK" || text == "GOOD") {
            color = "green";
          } else {
            color = "#CC0000";
          }
      
          return <h1 style={{ color: color }}>{text}</h1>;
        }
    },
    {
      title: "Tag Status",
      dataIndex: "Status_Tag",
      align: "center",
      width: "8%",
      responsive: ["lg"],
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
          <Tag color={color} style={{ width: 80 }}>
            {text}
          </Tag>
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
      createTagReturn(tag.Rec_NO);
      setCountTag(1);
    }
  };

  const onDeleteTagItem = () => {
    getReceiveStatus(tag.Rec_ID);
  };
  const refreshTag = () => {
    setDataSource([]);
    setLoading(true);

    setTimeout(() => {
      selectTag(tag?.Rec_ID);
      setLoading(false);
    }, 300);
  };

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

  return (
    <>
      <Modal
        visible={visible}
        title="Tag"
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
        <Form layout="vertical" form={formTagQR} name="formTagQR">
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card>
              <Form.Item name="Receive_Index" label="Receive_Index" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={5}>
                  <Form.Item name="Receive_No" label="Receive No :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="Receive_Date" label="Date :">
                    <DatePicker className="myDatePicker" style={{ background: "#f5f5f5" }} disabled />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item name="Total_QTY" label="Total QTY :">
                    <Input style={{ textAlign: "right",background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
              </Row>
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
                      style={{
                        marginTop: 16,
                        background: "green",
                        borderColor: "green",
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      type="primary"
                      onClick={onDeleteTagItem}
                      style={{
                        marginLeft: 8,
                        marginBottom: 16,
                        background: "orange",
                        borderColor: "orange",
                      }}
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
