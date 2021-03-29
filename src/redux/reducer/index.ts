import { ModalTypes } from "../../types/modal";
import { ActionTypes, MODAL_OPEN } from "../actions";

export interface UiState {
  isModalOpen: boolean;
  modalType: null | ModalTypes;
}

const initialState = {
  isModalOpen: false,
  modalType: null,
};

export const UiReducer = (
  state: UiState = initialState,
  action: ActionTypes
) => {
  switch (action.type) {
    case MODAL_OPEN:
      const { isModalOpen, modalType } = action.payload;
      return {
        ...state,
        isModalOpen,
        modalType,
      };

    default:
      return state;
  }
};
