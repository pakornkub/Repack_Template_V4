import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { 
  useGrade, 
  useDeleteGrade, 
  useCreateGrade, 
  useUpdateGrade 
} from "../../hooks/useGrade";
import { useDispatch, useSelector } from "react-redux";
import { setQR, selectQR } from "../../contexts/slices/qrSlice";
import FormGrade from "./FormGrade";

const Grade: React.FC<any> = () => {
  const [visible, setVisible] = useState(false);
  const [grade, setGrade] = useState<any>({});
  const [gradeSearch, setGradeSearch] = useState<any>([]);

  const [formGrade] = Form.useForm();
  const qr = useSelector(selectQR);
  const {
    isLoading,
    isFetching,
    isError,
    data: Gradedata,
    status,
    error,
  } = useGrade();

  const {
    mutate: createMutate,
  } = useCreateGrade();

  const {
    mutate: updateMutate,
  } = useUpdateGrade();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteGrade();

  const showModal = () => {
    formGrade.resetFields();

    setVisible(true);

    formGrade.setFieldsValue({
      Grade_Unit: "PC",
      Grade_Status: "1",
    });
  };

  const handleAddGrade = () => {
    showModal();
    setGrade({ event: "0" });
  };


  const handleCloseModal = () => {
    setVisible(false);
    formGrade.resetFields();
  };
 
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const gradeDataSearch = Gradedata?.data.data.filter((value: any) => {
        return Object.keys(value).some((key: any) =>
          String(value[key])
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        );
      });
      setGradeSearch(gradeDataSearch);
    } else {
      setGradeSearch(Gradedata?.data.data || []);
    }
  };

  useEffect(() => {
    setGradeSearch(Gradedata?.data.data || []);
  }, [isFetching]);


  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Material Success");
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

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
        showModal();
        setGrade({ ...record, event: e.key });

        break;
      case "2":
        Modal.confirm({
          title: "Delete Confirm",
          content: (
            <>{`Do you want delete Material Code : ${record.ITEM_CODE} ?`}</>
          ),
          onOk: () => {
            deleteMutate(record.ITEM_ID);
          },
        });

        break;
    }
  };

  const columns = [
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
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      align: "center",
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "Description",
      dataIndex: "ITEM_DESCRIPTION",
      key: "ITEM_DESCRIPTION",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        a.ITEM_DESCRIPTION.localeCompare(b.ITEM_DESCRIPTION),
    },
    {
      title: "Product Type",
      dataIndex: "Product_DESCRIPTION",
      key: "Product_DESCRIPTION",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Product_DESCRIPTION.localeCompare(b.Product_DESCRIPTION),
    },
    {
      title: "Unit",
      dataIndex: "Unit",
      key: "Unit",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Unit.localeCompare(b.Unit),
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
      dataIndex: "Create_By",
      key: "Create_By",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Create_By.localeCompare(b.Create_By),
    },
    {
      title: "Create Date",
      dataIndex: "Add_Date",
      key: "Add_Date",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) =>
        moment(a.Add_Date).unix() - moment(b.Add_Date).unix(),
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
              onClick={handleAddGrade}
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
          rowKey={(record: any) => record.ITEM_ID}
          rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'}
          bordered
          size="small"
          loading={isLoading}
          columns={columns as any}
          dataSource={gradeSearch}
          pagination={{ pageSize: 50 }}
          // scroll={{ y: 800 }}
        />
      </Space>

      <FormGrade
        visible={visible}
        handleCloseModal={handleCloseModal}
        grade={grade}
      />

      
    </>
  );
};

export default Grade;
