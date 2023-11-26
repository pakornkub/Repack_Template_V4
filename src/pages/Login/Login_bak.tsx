import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  Form,
  Input,
  Button,
  Space,
  Checkbox,
  Image,
  Typography,
  Layout,
  message,
} from "antd";
import {
  LoginOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";

import { useAuthLogin } from "../../hooks/useLogin";

import { IAuthLoginParams, ILoginStyle } from "../../types/pages/Login";

import logo from "../../assets/toto-logo-login.png";
import "./Login.css";

const Login: React.FC = () => {
  const { Title } = Typography;
  const { Header, Content } = Layout;

  const { isLoading, isError, error, status, mutate } = useAuthLogin();

  const [formLogin] = Form.useForm();
  const navigate = useNavigate();

  const [cookies, setCookie] = useCookies(["username", "password"]);

  const handleSignIn = (values: IAuthLoginParams) => {
    if (formLogin.getFieldValue("remember")) {
      setCookie("username", values.username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
     /*  setCookie("password", values.password, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }); */
    }

    mutate(values);
  };

  const handleSignInFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (status === "success") {
      message.success("Login Success");
      navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/Main`);
    } else if (status === "error") {
      message.error(error?.response?.data?.message || error.message);
    }
  }, [status]);

  return (
    <>
      <div className="bg-pk-template bg-login">
        <Content className="content-login">
          <Space direction="vertical" size="large">
            <div className="logo-login">
              <Image src={logo} preview={false} style={{ width: 500 }} />
            </div>

            <div className="form-login">
              <Title
                style={{
                  fontWeight: "bold",
                  marginBottom: 30,
                  color: "rgba(128,128,128,1)",
                }}
                level={4}
                className="font-sans text-center"
              >
                REPACK SYSTEM
              </Title>
              <Form
                size="large"
                form={formLogin}
                name="formLogin"
                initialValues={{
                  username: cookies.username,
                  password: cookies.password,
                  remember: true,
                }}
                onFinish={handleSignIn}
                onFinishFailed={handleSignInFailed}
                onReset={() => formLogin.resetFields()}
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input
                    className="username"
                    prefix={<UserOutlined />}
                    placeholder={`  Username`}
                    size="large"
                    allowClear
                    style={style.input}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder={`  Password`}
                    size="large"
                    allowClear
                    style={style.input}
                  />
                </Form.Item>
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox className="font-bold">Remember me</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<LoginOutlined className="relative bottom-1" />}
                    loading={isLoading}
                    style={style.button}
                    className="w-full"
                  >
                    SIGN IN
                  </Button>

                  {/*  <Button
                    htmlType="reset"
                    icon={<RestOutlined className="relative bottom-1" />}
                    style={style.button}
                    className="btn-form-login"
                  >
                    RESET
                  </Button>

                  <Button
                    type="dashed"
                    icon={<FileOutlined className="relative bottom-1" />}
                    style={style.button}
                    className="btn-form-login"
                    onClick={() =>
                      formLogin.setFieldsValue({
                        username: "pakorn.wo",
                        password: "1234",
                      })
                    }
                  >
                    FILL DATA
                  </Button> */}
                </Form.Item>
              </Form>
            </div>
          </Space>
        </Content>
      </div>
    </>
  );
};

const style = {} as ILoginStyle;

style.input = {
  borderRadius: 5,
};

style.button = {
  borderRadius: 5,
  fontWeight: "bold",
};

export default Login;
