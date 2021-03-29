import { Modal } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../redux/actions";
import { UiState } from "../../redux/reducer";
import { ModalTypes } from "../../types/modal";
import { AddWidgetModalContent } from "../Modals";

export const ModalWrapper = () => {
  const [modalAction, setModalAction] = useState<any>(null);
  const isModalOpen = useSelector((state: UiState) => state.isModalOpen);
  const modalType = useSelector((state: UiState) => state.modalType);
  const dispatch = useDispatch();

  function onOkayHandler() {
    dispatch(actions.setModalOpen(false));
    dispatch(modalAction());
  }

  function onCancelHandler() {
    dispatch(actions.setModalOpen(false));
  }

  function renderModal() {
    switch (modalType) {
      case ModalTypes.AddWidget:
        return (
          <AddWidgetModalContent setModalActionCallback={setModalAction} />
        );
      default:
        return <div>N/A</div>;
    }
  }

  return (
    <Modal
      visible={isModalOpen}
      onOk={onOkayHandler}
      onCancel={onCancelHandler}
    >
      {renderModal()}
    </Modal>
  );
};
