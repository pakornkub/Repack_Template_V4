import React, { useState, useEffect} from "react";
import {
  Table,
  Space,
  Button,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  Card,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { CloseOutlined } from "@ant-design/icons";
import { useStockGroup, useStockDetail, useStockWH, useStockWHHeader} from "../../hooks/useStockMonitor";
import { useGrade } from "../../hooks/useGrade";
import { useProductType } from "../../hooks/useProductType";
import { useLocation } from "../../hooks/useLocation";
import type { FormInstance } from "antd/lib/form";

import { useSelector } from "react-redux";

import { selectAuth } from "../../contexts/slices/authSlice";
import Template from "../../components/Template2";
import "./StockMonitor.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface DataType {
  key_index: React.Key;
  Grade_ID: Number;
  Grade_Name: string;
  Lot_No: string;
  QTY: Number;
}

const StoreMonitor: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);

  const [loading, setLoading] = useState(false);
  const [visibleGroup, setVisibleGroup] = useState(false);
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleWH, setVisibleWH] = useState(false);

  const [dataStockGroup, setDataStockGroup] = useState<DataType[]>([]);
  const [dataStockDetail, setDataStockDetail] = useState<DataType[]>([]);
  const [dataStockWH, setDataStockWH] = useState<DataType[]>([]);

  const [formStockGroup] = Form.useForm();
  const [formStockDetail] = Form.useForm();
  const [formStockWH] = Form.useForm();
  const [formStockWHHeader] = Form.useForm();
  const { Option } = Select;

  const { TabPane } = Tabs;

  const [totalQtyGroup, setTotalQtyGroup] = useState<any>(0);
  const [totalQtyDetail, setTotalQtyDetail] = useState<any>(0);
  const [totalQtyWH, setTotalQtyWH] = useState<any>(0);

  const {
    data: StockGroup,
    status: getStatusStockGroup,
    mutate: getStockGroup,
  } = useStockGroup();

  const {
    data: StockDetail,
    status: getStatusStockDetail,
    mutate: getStockDetail,
  } = useStockDetail();

  const {
    data: StockWH,
    status: getStatusStockWH,
    mutate: getStockWH,
  } = useStockWH();

  const {
    data: StockWHHeader,
    status: getStatusStockWHHeader,
    mutate: getStockWHHeader,
  } = useStockWHHeader();

  const {
    data: GradeItem,
  } = useGrade();

  const {
    data: ProductType,
  } = useProductType();

  const {
    data: Location,
  } = useLocation();

  useEffect(() => {
    if (getStatusStockGroup === "success") {
      setDataStockGroup(StockGroup?.data.data || []);
      const initialValue = 0;
      if (!StockGroup?.data || StockGroup.data.length <= 0) {
        setTotalQtyGroup(0);
      } else {
        const sumWithInitial = StockGroup?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.Qty),
          initialValue
        );
        setTotalQtyGroup(sumWithInitial);
      }
      handleCancel();
    }
  }, [getStatusStockGroup]);


  useEffect(() => {
    if (getStatusStockDetail === "success") {
      setDataStockDetail(StockDetail?.data.data || []);

      const initialValue = 0;
      if (!StockDetail?.data || StockDetail.data.length <= 0) {
        setTotalQtyDetail(0);
      } else {
        const sumWithInitial = StockDetail?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.QTY),
          initialValue
        );
        setTotalQtyDetail(sumWithInitial);
      }
      handleCancel();
    }
  }, [getStatusStockDetail]);

  useEffect(() => {
    if (getStatusStockWH === "success") {
      setDataStockWH(StockWH?.data.data || []);

      const initialValue = 0;
      if (!StockWH?.data || StockWH.data.length <= 0) {
        setTotalQtyWH(0);
      } else {
        const sumWithInitial = StockWH?.data.data.reduce(
          (previousValue: any, currentValue: any) =>
            previousValue + Number(currentValue.QTY),
          initialValue
        );
        setTotalQtyWH(sumWithInitial);
      }
      handleCancel();
    }
  }, [getStatusStockWH]);

  useEffect(() => {
    if (getStatusStockWHHeader === "success") {

      if (!StockWHHeader?.data || StockWHHeader.data.length <= 0) {
        formStockWHHeader.resetFields();
      } else {
        formStockWHHeader.setFieldsValue({
          Box_No: StockWHHeader?.data.data[0].QR_NO || "",
          Pack_By: StockWHHeader?.data.data[0].Pack_By || "",
          Production_Date: StockWHHeader?.data.data[0].Production_Date || "",
          Approve_By: StockWHHeader?.data.data[0].ApproveBy || "",
        });
      }
      handleCancel();
    }
  }, [getStatusStockWHHeader]);



  const handleSearchGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const StockGroupSearch = StockGroup?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setDataStockGroup(StockGroupSearch);
    } else {
      setDataStockGroup(StockGroup?.data.data || []);
    }
  };

  const handleSearchDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const StockDetailSearch = StockDetail?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setDataStockDetail(StockDetailSearch);
    } else {
      setDataStockDetail(StockDetail?.data.data || []);
    }
  };

  const handleSearchWH = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const StockWHSearch = StockWH?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setDataStockWH(StockWHSearch);
    } else {
      setDataStockWH(StockWH?.data.data || []);
    }
  };

  const onChange = (key: string) => {
    // console.log(key);
  };

  const showModalGroup = (value: any) => {
    setVisibleGroup(true);
  };

  const showModalDetail = (value: any) => {
    setVisibleDetail(true);
  };

  const showModalWH = (value: any) => {
    setVisibleWH(true);
  };

  const handleCancel = () => {
    setVisibleGroup(false);
    setVisibleDetail(false);
    setVisibleWH(false);
  };

  const handleClear = () => {
    formStockGroup.resetFields();
    formStockDetail.resetFields();
    formStockWH.resetFields();
  };

  const handleClearGroup = () => {
    formStockGroup.resetFields();
  };
  const handleClearDetail = () => {
    formStockDetail.resetFields();
  };
  const handleClearWH = () => {
    formStockWH.resetFields();
  };

  const handleOkGroup = (value: any) => {
    let str = "WHERE QTY > 0";

    if (value.Product_Type != undefined || value.Product_Type != null) {
      str += " AND Product_ID = " + value.Product_Type;
    }
    if (value.Location != undefined || value.Location != null) {
      str += " AND Location_ID = " + value.Location;
    }
    if (value.Grade_ID != undefined || value.Grade_ID != null) {
      str += " AND ITEM_ID = " + value.Grade_ID;
    }

    getStockGroup(str);
  };

  const handleOkDetail = (value: any) => {

    let str = "WHERE QTY > 0";

    if (value.Product_Type != undefined || value.Product_Type != null) {
      str += " AND Product_ID = " + value.Product_Type;
    }
    if (value.Location != undefined || value.Location != null) {
      str += " AND Location_ID = " + value.Location;
    }
    if (value.Grade_ID != undefined || value.Grade_ID != null) {
      str += " AND ITEM_ID = " + value.Grade_ID;
    }
    if (value.QR_Code != undefined && value.QR_Code != '') {
      str += " AND QR_NO = '" + value.QR_Code+"'";
    }
    if (value.Lot_No != undefined && value.Lot_No != '') {
      str += " AND LOT = '" + value.Lot_No+"'";
    }
    getStockDetail(str);
  };

  const handleOkWH = (value: any) => {
    getStockWHHeader(value.Spare_part);
    getStockWH(value.Spare_part);
  };


  const columns_group = [
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Location.localeCompare(b.Location),
    },
    {
      title: "Product Type",
      dataIndex: "Product_DESCRIPTION",
      key: "Product_DESCRIPTION",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.Product_DESCRIPTION.localeCompare(b.Product_DESCRIPTION),
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      width: "20%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },

    {
      title: "Material Description",
      dataIndex: "ITEM_DESCRIPTION",
      key: "ITEM_DESCRIPTION",
      width: "30%",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.ITEM_DESCRIPTION.localeCompare(b.ITEM_DESCRIPTION),
    },
    {
      title: "Status",
      dataIndex: "Status_desc",
      key: "Status_desc",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Status_desc.localeCompare(b.Status_desc),
      render: (text: any, color: any) => {
        if (text == "LOCK") {
          color = "red";
        } else if (text == "UNLOCK" || text == "GOOD") {
          color = "green";
        } else if (text == "APPROVE" ) {
          color = "blue";
        } else {
          color = "#CC0000";
        }
    
        return <h1 style={{ color: color }}>{text}</h1>;
      }
    },

    {
      title: "QTY",
      dataIndex: "Qty",
      key: "Qty",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Qty.localeCompare(b.Qty),
    },
    {
      title: "Unit",
      dataIndex: "Unit",
      key: "Unit",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Unit.localeCompare(b.Unit),
    },
  ];



  const columns_detail = [
    {
      title: "QR Code",
      dataIndex: "QR_NO",
      key: "QR_NO",
      width: "13%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.QR_NO.localeCompare(b.QR_NO),
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location",
      align: "center",
      width: "15%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Location.localeCompare(b.Location),
    },
    {
      title: "Product Type",
      dataIndex: "Product_DESCRIPTION",
      key: "Product_DESCRIPTION",
      align: "center",
      width: "12%",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.Product_DESCRIPTION.localeCompare(b.Product_DESCRIPTION),
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      width: "20%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },

    {
      title: "Material Description",
      dataIndex: "ITEM_DESCRIPTION",
      key: "ITEM_DESCRIPTION",
      width: "30%",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.ITEM_DESCRIPTION.localeCompare(b.ITEM_DESCRIPTION),
    },
    {
      title: "Lot No",
      dataIndex: "LOT",
      key: "LOT",
      width: "10%",
      responsive: ["lg"],
    },
    {
      title: "Ref No",
      dataIndex: "Ref_No",
      key: "Ref_No",
      width: "15%",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.Ref_No.localeCompare(b.Ref_No),
    },
    {
      title: "Status",
      dataIndex: "Status_desc",
      key: "Status_desc",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Status_desc.localeCompare(b.Status_desc),
      render: (text: any, color: any) => {
        if (text == "LOCK") {
          color = "red";
        } else if (text == "UNLOCK" || text == "GOOD") {
          color = "green";
        } else if (text == "APPROVE" ) {
          color = "blue";
        } else {
          color = "#CC0000";
        }
    
        return <h1 style={{ color: color }}>{text}</h1>;
      }
    },

    {
      title: "QTY",
      dataIndex: "QTY",
      key: "QTY",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.QTY.localeCompare(b.QTY),
    },
    {
      title: "Unit",
      dataIndex: "Unit",
      key: "Unit",
      align: "center",
      width: "10%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Unit.localeCompare(b.Unit),
    },
  ];

  const columns_wh = [
    {
      title: "QR Code",
      dataIndex: "QR_NO",
      key: "QR_NO",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.QR_NO.localeCompare(b.QR_NO),
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },

    {
      title: "Material Description",
      dataIndex: "ITEM_DESCRIPTION",
      key: "ITEM_DESCRIPTION",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.ITEM_DESCRIPTION.localeCompare(b.ITEM_DESCRIPTION),
    },
    {
      title: "QTY",
      dataIndex: "QTY",
      key: "QTY",
      align: "center",
      width: "15%",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.QTY.localeCompare(b.QTY),
    },
    {
      title: "Receive No",
      dataIndex: "Ref_num",
      key: "Ref_num",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Ref_num.localeCompare(b.Ref_num),
    },
    {
      title: "Add By",
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
            {/* <Col className="flex justify-end items-center" flex={1}>
              <Button
                type="primary"
                style={{ background: "blue", borderColor: "blue" }}
                icon={<FilterOutlined className="relative bottom-[0.2em]" />}
                onClick={() => showModal("Add")}
              >
                Filter
              </Button>
            </Col> */}
          </Row>

          <Tabs onChange={onChange} type="card">
            <TabPane tab="Group Product" key="1">
              <Row style={{ marginBottom: 8 }}>
                <Col flex={1}>
                  <Button
                    type="primary"
                    className="btn-info"
                    icon={<FilterOutlined className="relative bottom-[0.2em]" />}
                    onClick={() => showModalGroup("Search")}
                  >
                    Filter
                  </Button>
                </Col>
                <Col className="flex justify-end items-center" flex={1}>
                  <Input
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    placeholder="Search"
                    onChange={(e) => handleSearchGroup(e)}
                  />
                </Col>
              </Row>

              <Table
                bordered
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                size="small"
                // loading={isLoading}
                columns={columns_group as any}
                dataSource={dataStockGroup}
                pagination={{ pageSize: 100 }}
                scroll={{ y: 600 }}
                footer={() => (
                  <div>
                    {"Total QTY : "}
                    {totalQtyGroup}
                  </div>
                )}
              />

            </TabPane>

            <TabPane tab="Detial Product" key="2">
              <Row style={{ marginBottom: 8 }}>
                <Col flex={1}>
                  <Button
                    type="primary"
                    className="btn-info"
                    icon={<FilterOutlined className="relative bottom-[0.2em]" />}
                    onClick={() => showModalDetail("Search")}
                  >
                    Filter
                  </Button>
                </Col>
                <Col className="flex justify-end items-center" flex={1}>
                  <Input
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    placeholder="Search"
                    onChange={(e) => handleSearchDetail(e)}
                  />
                </Col>
              </Row>
              <Table
                bordered
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                size="small"
                // loading={isLoading}
                columns={columns_detail as any}
                dataSource={dataStockDetail}
                pagination={{ pageSize: 100 }}
                scroll={{ y: 600 }}
                footer={() => (
                  <div>
                    {"Total QTY : "}
                    {totalQtyDetail}
                  </div>
                )}
              />
            </TabPane>

            <TabPane tab="WH" key="3">
              <Row style={{ marginBottom: 8 }}>
                <Col flex={1}>
                  <Button
                    type="primary"
                    className="btn-info"
                    icon={<FilterOutlined className="relative bottom-[0.2em]" />}
                    onClick={() => showModalWH("Search")}
                  >
                    Filter
                  </Button>
                </Col>
                <Col className="flex justify-end items-center" flex={1}>
                  <Input
                    style={{ width: 300 }}
                    prefix={<SearchOutlined />}
                    placeholder="Search"
                    onChange={(e) => handleSearchWH(e)}
                  />
                </Col>
              </Row>
              <Form
                layout="vertical"
                form={formStockWHHeader}
                name="formCountStockHeader"
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  <Card>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item name="Box_No" label="Box No. " >
                          <Input readOnly/>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="Pack_By" label="Pack By. " >
                          <Input readOnly/>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="Production_Date" label="วันที่ผลิต " >
                          <Input readOnly/>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="Approve_By" label="Approve By." >
                          <Input readOnly/>
                        </Form.Item>
                      </Col>
                      
                    </Row>

                  </Card>
                </Space>
              </Form>
              <Table
                style={{ marginTop:8}}
                bordered
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
                size="small"
                // loading={isLoading}
                columns={columns_wh as any}
                dataSource={dataStockWH}
                pagination={{ pageSize: 100 }}
                scroll={{ y: 600 }}
              />
            </TabPane>
          </Tabs>
          

          {/* --------------------Modal Group------------------- */}
          <Modal
            visible={visibleGroup}
            title="Search"
            style={{ top: 20 }}
            onOk={formStockGroup.submit}
            onCancel={handleCancel}
            width={600}
            footer={[
              <table style={{ width: "100%" }}>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <Button
                      key="back"
                      type="primary"
                      className="btn-warning"
                      onClick={handleClearGroup}
                      style={{
                        marginLeft: 8,
                      }}
                      icon={
                        <ClearOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Clear
                    </Button>
                  </td>
                  <td>
                    <Button
                      key="submit"
                      type="primary"
                      loading={loading}
                      onClick={formStockGroup.submit}
                      className="btn-info"
                      icon={
                        <SearchOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Search
                    </Button>
                    <Button
                      key="back"
                      type="ghost"
                      danger
                      onClick={handleCancel}
                      style={{
                        marginRight: 8,
                      }}
                      icon={
                        <CloseOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              </table>,
            ]}
          >
            <Form
              layout="vertical"
              form={formStockGroup}
              name="formCountStock"
              onFinish={handleOkGroup}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <Card>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="Product_Type" label="Product Type :">
                        <Select
                          placeholder="Please choose Product Type"
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
                    <Col span={12}>
                      <Form.Item name="Location" label="Location :">
                        <Select
                          placeholder="Please choose Location"
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
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="Grade_ID" label="Material :">
                        <Select
                          placeholder="Please choose Material"
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
                   </Row>
                </Card>
              </Space>
            </Form>
          </Modal>

          {/* --------------------Modal Detail------------------- */}
          <Modal
            visible={visibleDetail}
            title="Search Detail"
            style={{ top: 20 }}
            onOk={formStockDetail.submit}
            onCancel={handleCancel}
            width={600}
            footer={[
              <table style={{ width: "100%" }}>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <Button
                      key="back"
                      type="primary"
                      className="btn-warning"
                      onClick={handleClearDetail}
                      style={{
                        marginLeft: 8,
                      }}
                      icon={
                        <ClearOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Clear
                    </Button>
                  </td>
                  <td>
                    <Button
                      key="submit"
                      type="primary"
                      className="btn-info"
                      loading={loading}
                      onClick={formStockDetail.submit}
                      icon={
                        <SearchOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Search
                    </Button>
                    <Button
                      key="back"
                      type="ghost"
                      danger
                      onClick={handleCancel}
                      style={{
                        marginRight: 8,
                      }}
                      icon={
                        <CloseOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              </table>,
            ]}
          >
            <Form
              layout="vertical"
              form={formStockDetail}
              name="formCountStock"
              onFinish={handleOkDetail}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <Card>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="Product_Type" label="Product Type :">
                        <Select
                          placeholder="Please choose Product Type"
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
                    <Col span={12}>
                      <Form.Item name="Location" label="Location :">
                        <Select
                          placeholder="Please choose Location"
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
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="Grade_ID" label="Material :">
                        <Select
                          placeholder="Please choose Material"
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
                    <Col span={12}>
                      <Form.Item name="QR_Code" label="QR Code :" >
                       
                        <Input placeholder="Please enter QR Code"/>
                      </Form.Item>
                    </Col>
                   </Row>
                   <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="Lot_No" label="Lot No :" >
                       
                        <Input placeholder="Please enter Lot No"/>
                      </Form.Item>
                    </Col>
                   </Row>
                </Card>
              </Space>
            </Form>
          </Modal>
          
          {/* --------------------Modal WH------------------- */}
          <Modal
            visible={visibleWH}
            title="Search WH"
            style={{ top: 20 }}
            onOk={formStockWH.submit}
            onCancel={handleCancel}
            width={600}
            footer={[
              <table style={{ width: "100%" }}>
                <tr>
                  <td style={{ textAlign: "left" }}>
                    <Button
                      key="back"
                      type="primary"
                      className="btn-warning"
                      onClick={handleClearWH}
                      style={{
                        marginLeft: 8,
                      }}
                      icon={
                        <ClearOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Clear
                    </Button>
                  </td>
                  <td>
                    <Button
                      key="submit"
                      type="primary"
                      className="btn-info"
                      loading={loading}
                      onClick={formStockWH.submit}
                      icon={
                        <SearchOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Search
                    </Button>
                    <Button
                      key="back"
                      type="ghost"
                      danger
                      onClick={handleCancel}
                      style={{
                        marginRight: 8,
                      }}
                      icon={
                        <CloseOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              </table>,
            ]}
          >
            <Form
              layout="vertical"
              form={formStockWH}
              name="formCountStock"
              onFinish={handleOkWH}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <Card>
                  <Row gutter={16}>
                    <Col span={5}></Col>
                    <Col span={14}>
                      <Form.Item name="Spare_part" label="Part :" 
                      rules={[{ required: true, message: "Please enter Part" }]}>
                       
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={5}></Col>
                    
                  </Row>

                </Card>
              </Space>
            </Form>
          </Modal>
        </Space>
      </Template>
      ;
    </>
  );
};

export default StoreMonitor;
