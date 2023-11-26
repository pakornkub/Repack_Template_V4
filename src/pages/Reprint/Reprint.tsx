import React, { useState, useEffect} from "react";
import {
  Space,
  Button,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  Card,
} from "antd";
import {
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useReprintQrCode } from "../../hooks/useReprint";
import { selectAuth } from "../../contexts/slices/authSlice";
import Template from "../../components/Template2";
import "./Reprint.css";
import QRCode from "react-qr-code";

const Reprint: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);


  const [loading, setLoading] = useState(false);
  const [formQrCode] = Form.useForm();
  const { Option } = Select;
  const [dataQrCode, setDataQrCode] = useState<any>([]);
  const [dataQrCodePreview, setDataQrCodePreview] = useState<any>('[{"QR_NO":"","Tag_ID":0,"Item_ID":0,"ITEM_CODE":"","Lot_No":"","Series":""}]');
  const [dataQrCodePreview1, setDataQrCodePreview1] = useState<any>('[{"QR_NO":"","Tag_ID":0,"Item_ID":0,"ITEM_CODE":"","Lot_No":"","Series":""}]');

  const [hiddenDivQrCode, setHiddenDivQrCode] = useState(true);
  const [hiddenDivQrCode1, setHiddenDivQrCode1] = useState(true);

  const gridStyle: React.CSSProperties = {
    width: "50%",
    height: "100%",
    paddingTop: "20px",
    paddingLeft: "5px",
    paddingRight: "5px",
    boxShadow: "1px 1px 1px #fff",
  };
  

  const {
    data: QrCode,
    status: getStatusQrCode,
    mutate: getQrCode,
  } = useReprintQrCode();


  useEffect(() => {
    if (getStatusQrCode === "success") {
      setDataQrCode(QrCode?.data.data || []);

      if(QrCode?.data.data == undefined){
        Modal.error({
          title: "Message",
          content: `Search QR Code not found!`,
        });
        setHiddenDivQrCode(true);
        setHiddenDivQrCode1(true);
      }else{
        setHiddenDivQrCode(false);
        console.log('Fuck =',QrCode);
        console.log('Type =',QrCode?.data.data[0].Product_ID);
        if(QrCode?.data.data[0].Product_ID == 4){
          setHiddenDivQrCode1(false);
          const Arr = [
            { QR_NO: QrCode?.data.data[0].QR_NO, 
              Tag_ID: QrCode?.data.data[0].Tag_ID, 
              Item_ID: QrCode?.data.data[0].Item_ID,
              ITEM_CODE:QrCode?.data.data[0].ITEM_CODE,
              Lot_No:QrCode?.data.data[0].Lot_No,
              Series:'BOX',
            },
          ];
          const Arr1 = [
            { QR_NO: QrCode?.data.data[0].QR_NO, 
              Tag_ID: QrCode?.data.data[0].Tag_ID, 
              Item_ID: QrCode?.data.data[0].Item_ID,
              ITEM_CODE:QrCode?.data.data[0].ITEM_CODE,
              Lot_No:QrCode?.data.data[0].Lot_No,
              Series:'WARE',
            },
          ];
          setDataQrCodePreview(JSON.stringify(Arr));
          setDataQrCodePreview1(JSON.stringify(Arr1));

          formQrCode.setFieldsValue({
            ITEM_CODE: QrCode?.data.data[0].ITEM_CODE || null,
            ITEM_DES: QrCode?.data.data[0].ITEM_DESCRIPTION || null,
            Lot_No: 'Lot No : ' + QrCode?.data.data[0].Lot_No || null,
            QR: 'QR Code : ' + QrCode?.data.data[0].QR_NO || null,
            Series: 'Series : BOX',
            ITEM_CODE1: QrCode?.data.data[0].ITEM_CODE || null,
            ITEM_DES1: QrCode?.data.data[0].ITEM_DESCRIPTION || null,
            Lot_No1: 'Lot No : ' + QrCode?.data.data[0].Lot_No || null,
            QR1: 'QR Code : ' + QrCode?.data.data[0].QR_NO || null,
            Series1: 'Series : WARE',
          });


        }else{
          setHiddenDivQrCode1(true);
          const Arr2 = [
            { QR_NO: QrCode?.data.data[0].QR_NO, 
              Tag_ID: QrCode?.data.data[0].Tag_ID, 
              Item_ID: QrCode?.data.data[0].Item_ID,
              ITEM_CODE:QrCode?.data.data[0].ITEM_CODE,
              Lot_No:QrCode?.data.data[0].Lot_No,
              Series:null,
            },
          ];
          setDataQrCodePreview(JSON.stringify(Arr2));

          formQrCode.setFieldsValue({
            ITEM_CODE: QrCode?.data.data[0].ITEM_CODE || null,
            ITEM_DES: QrCode?.data.data[0].ITEM_DESCRIPTION || null,
            Lot_No: 'Lot No : ' + QrCode?.data.data[0].Lot_No || null,
            QR: 'QR Code : ' + QrCode?.data.data[0].QR_NO || null,
            Series: 'Series : -',
          });
        }
        
          
        

        setTimeout(() => {
          localStorage.setItem("qr", JSON.stringify(QrCode?.data.data[0]));

          window.open(
            `${import.meta.env.VITE_APP_PUBLIC_URL}${"/QrCodePrint"}`
          );
        }, 500)
        
      }
      
    }
  }, [getStatusQrCode]);


  const handleCancel = () => {
    formQrCode.resetFields();
    setHiddenDivQrCode(true);
    setHiddenDivQrCode1(true);
  };


  const handleOk = (value: any) => {
    let str = "WHERE ";
    
    if (value.QR_Code != undefined && value.QR_Code != '') {
      str += "QR_NO = '" + value.QR_Code+"'";
    }
    getQrCode(str);
  };



  return (
    <>
    <Template
        mainMenuId={MenuId}
        listSubMenu={authResult.data.permission.filter(
          (value: any) => parseInt(value.Route.split(".")[0]) === Menu_Index
        )}
    >
      <Space
        className="w-[100%]"
        direction="vertical"
        style={{ marginTop: -10 }}
      >
        <div>
          <Form
            layout="vertical"
            form={formQrCode}
            name="formQrCode"
            onFinish={handleOk}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Card>
                <Row gutter={24} style={{ marginTop: -10, marginBottom: -35 }}>
                  <Col>QR Code :</Col>
                  <Col>
                    <Form.Item 
                      name="QR_Code" 
                      label="" 
                      rules={[{ required: true, message: "Please enter QR Code" }]}>
                      <Input placeholder="Please enter QR Code"/>
                    </Form.Item>
                  </Col>
                  <Col>
                  <Button
                      key="submit"
                      type="primary"
                      className="btn-info"
                      loading={loading}
                      onClick={formQrCode.submit}
                      icon={
                        <SearchOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Search
                    </Button>
                    &nbsp;
                    <Button
                      key="back"
                      type="primary"
                      className="btn-warning"
                      danger
                      onClick={handleCancel}
                      icon={<ClearOutlined className="relative bottom-[0.2em]" />}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Card>

              <div className="print-source print-preview" hidden={hiddenDivQrCode}>

                <Card>
                  <table>
                    <tr>
                      <td>
                        <div style={{marginLeft:20,marginTop:7}}>
                          <QRCode
                              value={dataQrCodePreview}
                              size={235}
                              style={{ height: "auto", maxWidth: "100%", width: "98%" }}
                              viewBox={`0 0 256 256`}
                            />
                        </div>
                      </td>
                      <td>
                      <Row gutter={16} style={{marginTop:10}}>
                        <Col span={24}>
                          <Form.Item name="ITEM_CODE" label="">
                            <Input style={{ width: "500px",background: "#ffffff",border: "0px"}} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="ITEM_DES" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="Lot_No" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="QR" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="Series" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      </td>
                    </tr>
                  </table>
                </Card>
                    
                
                
              
            </div>     

            <div className="print-source print-preview" hidden={hiddenDivQrCode1}>

                <Card>
                  <table>
                    <tr>
                      <td>
                        <div style={{marginLeft:20,marginTop:7}}>
                          <QRCode
                              value={dataQrCodePreview1}
                              size={235}
                              style={{ height: "auto", maxWidth: "100%", width: "98%" }}
                              viewBox={`0 0 256 256`}
                            />
                        </div>
                      </td>
                      <td>
                      <Row gutter={16} style={{marginTop:10}}>
                        <Col span={24}>
                          <Form.Item name="ITEM_CODE1" label="">
                            <Input style={{ width: "500px",background: "#ffffff",border: "0px"}} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="ITEM_DES1" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="Lot_No1" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="QR1" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginTop:-10}}>
                        <Col span={24}>
                          <Form.Item name="Series1" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      </td>
                    </tr>
                  </table>
                </Card>
                    
                
                
              
            </div>     
              
            </Space>
            
          </Form>
        </div>
      </Space>
    </Template>
   
    </>
  );
};

export default Reprint;
