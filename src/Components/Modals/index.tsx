import { Radio } from "antd";

export const AddWidgetModalContent = ({
  setModalActionCallback,
}: {
  setModalActionCallback: any;
}) => {
  return (
    <Radio.Group>
      <Radio
        value={"addRedditThreadTracker"}
        onChange={() => setModalActionCallback("reference to fxn")}
      >
        Add Reddit Thread Tracker
      </Radio>
      <Radio
        value={"addStockTracker"}
        onChange={() => setModalActionCallback("reference to fxn")}
      >
        Add Stock Tracker
      </Radio>
    </Radio.Group>
  );
};
