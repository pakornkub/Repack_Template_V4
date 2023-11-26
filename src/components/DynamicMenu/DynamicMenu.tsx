import Setting from "../../pages/Setting";
import Master from "../../pages/Master";
import Transaction from "../../pages/Transaction";
import Menu from "../../pages/Menu";
import MenuPermission from "../../pages/MenuPermission";
import User from "../../pages/User";
import Group from "../../pages/Group";
import Grade from "../../pages/Grade";
import Error404 from "../../pages/Error404";
import BOM from "../../pages/BOM";
import ReceivePart from "../../pages/ReceivePart";
import ReceiveReturn from "../../pages/ReceiveReturn";
import JobPlan from "../../pages/JobPlan";
import JobRepack from "../../pages/JobRepack";
import CountStock from "../../pages/CountStock";
import StockMonitor from "../../pages/StockMonitor";
import Reprint from "../../pages/Reprint";

const DynamicMenu: React.FC<any> = (props) => {
  const menu: any = {
    Setting: <Setting {...props} />,
    Master: <Master {...props} />,
    Menu: <Menu {...props} />,
    MenuPermission: <MenuPermission {...props} />,
    User: <User {...props} />,
    Group: <Group {...props} />,
    Material: <Grade {...props} />,
    Transaction: <Transaction {...props} />,
    BOM: <BOM {...props} />,
    ReceivePart: <ReceivePart {...props} />,
    ReceiveReturn: <ReceiveReturn {...props} />,
    JobPlan: <JobPlan {...props} />,
    JobRepack: <JobRepack {...props} />,
    CountStock: <CountStock {...props} />,
    StockMonitor: <StockMonitor {...props} />,
    Reprint: <Reprint {...props} />,
  };

  return menu[props.MenuId] || <Error404 />;
};

export default DynamicMenu;

// Note : set menu name to dynamic menu
