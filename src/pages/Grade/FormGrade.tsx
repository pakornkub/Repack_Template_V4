import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
} from "antd";
import {
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { 
  useDeleteGrade, 
  useCreateGrade, 
  useUpdateGrade 
} from "../../hooks/useGrade";
import { useProductType } from "../../hooks/useProductType";

const FormGrade: React.FC<any> = ({ visible, handleCloseModal, grade }) => {

  const [loading, setLoading] = useState(false);
  const [hiddenPrint, setHiddenPrint] = useState(false);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);

  const [formGrade] = Form.useForm();
  const [formPrint] = Form.useForm();
  const { Option } = Select;
  

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateGrade();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateGrade();

  const {
    data: ProductType,
  } = useProductType();


  const handleOk = (value: any) => {
    setLoading(true);
    if (value?.Grade_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };


  
  const handleQtyPrint = (e:any) => {
    setDataSourcePrint({ITEM_CODE: grade?.ITEM_CODE, QTY: e});
  };



  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Material Success");
      handleCloseModal();
      setLoading(false);
    } else if (createStatus === "error") {
      setLoading(false);
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Material Success");
      handleCloseModal();
      setLoading(false);
    } else if (updateStatus === "error") {
      setLoading(false);
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);


  useEffect(() => {
    formGrade.resetFields();
    formGrade.setFieldsValue({
      Grade_Index: grade?.ITEM_ID || null,
      Grade_Id: grade?.ITEM_CODE || "",
      Grade_Description: grade?.ITEM_DESCRIPTION || "",
      Product_Type: grade?.Product_ID || null,
      Grade_Unit: grade?.Unit || "PC",
      Grade_Status: String(grade?.Status || "1"),
      Min_Qty: grade?.MinQTY || 0,
      Max_Qty: grade?.MaxQTY || 0,
    });

    if(grade?.Product_ID == '3'){
      setHiddenPrint(false); 
      formPrint.setFieldsValue({
        Num_Print: 1,
      });
      setDataSourcePrint({ITEM_CODE: grade?.ITEM_CODE, QTY: 1});
    }else{
      setHiddenPrint(true);
    }
    
    
  }, [grade]);


  return (
    <>
      <Modal
        visible={visible}
        title="Material"
        onOk={formGrade.submit}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formGrade.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCloseModal}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formGrade}
          name="formGrade"
          onFinish={handleOk}
        >
          <Form.Item name="Grade_Index" label="Grade Index" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Grade_Id"
                label="Material Code"
                rules={[{ required: true, message: "Please enter Material" }]}
              >
                <Input placeholder="Please enter Material" disabled={parseInt(grade?.event) !== 0 ? true : false}/>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Product_Type"
                label="Product Type"
                rules={[
                  { required: true, message: "Please choose Product Type" },
                ]}
              >
                <Select
                  placeholder="Please choose Product Type"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  
                >
                  {ProductType?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.Product_ID}
                        value={value.Product_ID}
                      >
                        {value.Product_DESCRIPTION}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="Grade_Description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter Description" },
                ]}
              >
                <Input placeholder="Please enter Description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Min_Qty"
                label="Min"
                rules={[{ required: true, message: "Please enter Min" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={100000}
                  placeholder="Please enter Min"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Max_Qty"
                label="Max"
                rules={[{ required: true, message: "Please enter Max" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={1000000}
                  placeholder="Please enter Max"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="Grade_Unit" label="Unit">
                <Select allowClear>
                  <Option value="PC">PC</Option>
                  <Option value="SET">SET</Option>
                  <Option value="UT">UT</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="Grade_Status" label="Status">
                <Select>
                  <Option value="0">Inactive</Option>
                  <Option value="1">Active</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
        <Form
          layout="vertical"
          form={formPrint}
          name="formPrint"
          hidden={hiddenPrint}
        >
        <Row gutter={16}>
        <Col span={7}>
              <Form.Item
                name="Num_Print"
                label="Number of Print"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  step="1"
                  min={1}
                  max={1000000}
                  placeholder="Number of Print"
                  onChange={(e) => handleQtyPrint(e)}
                />
              </Form.Item>
            </Col>
          <Col span={2}>
                  <Form.Item 
                    name="Num_Prin1t"
                    label=" ">
                    <Button
                      type="primary"
                      className="btn-info"
                      onClick={() => {
                        localStorage.setItem("qr", JSON.stringify(dataSourcePrint));

                        window.open(
                          `${
                            import.meta.env.VITE_APP_PUBLIC_URL
                          }${"/QrCodePrintMisc"}`
                        );
                      }}
                      // onClick={showModalPrint}
                    >
                      <PrinterOutlined />
                      Print
                    </Button>
                  </Form.Item>
                </Col>
            </Row>
          </Form>
      </Modal>

    </>
  );
};

export default FormGrade;
