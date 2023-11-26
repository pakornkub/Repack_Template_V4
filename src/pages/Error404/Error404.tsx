import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate(`${import.meta.env.VITE_APP_PUBLIC_URL}/`)}>
          Back
        </Button>
      }
    />
  );
};

export default Error404;
