import { PlusCircleOutlined, ToolOutlined } from "@ant-design/icons";
import { PageHeader, Button } from "antd";
import "antd/dist/antd.css";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/actions";
import { ModalTypes } from "../../types/modal";

export const AddComponent = () => {
  const dispatch = useDispatch();

  function onClickAddWidgetHandler() {
    dispatch(actions.setModalOpen(true, ModalTypes.AddWidget));
  }

  return (
    <PageHeader
      title={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={onClickAddWidgetHandler}
        >
          Add Widget
        </Button>
      }
      extra={<Button type="text" icon={<ToolOutlined />}></Button>}
    ></PageHeader>
  );
};
