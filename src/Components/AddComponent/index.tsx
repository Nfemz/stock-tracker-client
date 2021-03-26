import { PlusCircleOutlined, ToolOutlined } from "@ant-design/icons";
import { PageHeader, Button } from "antd";
import "antd/dist/antd.css";

export const AddComponent = () => {
  return (
    <PageHeader
      title={
        <Button type="primary" icon={<PlusCircleOutlined />}>
          Add Widget
        </Button>
      }
      extra={<Button type="text" icon={<ToolOutlined />}></Button>}
    ></PageHeader>
  );
};
