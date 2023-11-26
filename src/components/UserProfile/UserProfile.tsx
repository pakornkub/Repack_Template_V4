import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Space, Dropdown, Typography, Menu } from "antd";
import {
  UserOutlined,
  DownOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { setAuth, selectAuth } from "../../contexts/slices/authSlice";

import "./UserProfile.css";

const UserProfile : React.FC<any> = (props) => {
  const { Text } = Typography;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authResult } = useSelector(selectAuth);

  const handleSignOut = () => {
    dispatch(setAuth({}));
    navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`);
  };

  const menuUser = (
    <Menu>
      {/* <Menu.Item
        key={1}
        icon={<ProfileOutlined />}
        onClick={() => navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/Profile`)}
      >
        Profile
      </Menu.Item> */}
      <Menu.Item
        key={2}
        icon={<LogoutOutlined />}
        danger
        onClick={handleSignOut}
      >
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuUser} trigger={['click']} placement={"bottom"} arrow>
      <span className="ant-dropdown-link cursor-pointer" onClick={(e) => e.preventDefault()}>
        <Space size={20} className={props.mode == 'main' ? 'user' : 'user-light'}>
          <Avatar className="avatar right-[5px]" icon={<UserOutlined />} />
          <Text strong className="text-user" ellipsis={true}>
            {`${authResult?.data?.FirstName} ${authResult?.data?.LastName}`}
          </Text>
          <DownOutlined className="mb-6" />
        </Space>
        <Space className={props.mode == 'main' ? 'user-short' : 'user-short-light'}>
          <Avatar className="avatar" icon={<UserOutlined />} />
        </Space>
      </span>
    </Dropdown>
  );
};

export default UserProfile;
