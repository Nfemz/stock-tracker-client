import { ModalTypes } from "../../types/modal";

export const MODAL_OPEN: string = "MODAL_OPEN";
export const ADD_REDDIT_THREAD_TRACKER: string = "ADD_REDDIT_THREAD_TRACKER";
export const ADD_STOCK_TRACKER: string = "ADD_STOCK_TRACKER";

export const setModalOpen = (isModalOpen: boolean, modalType?: ModalTypes) => ({
  type: MODAL_OPEN,
  payload: {
    isModalOpen,
    modalType,
  },
});

export const addRedditThreadTracker = () => ({
  type: ADD_REDDIT_THREAD_TRACKER,
  payload: undefined,
});

export const addStockTracker = () => ({
  type: ADD_STOCK_TRACKER,
  payload: undefined,
});

export type ActionTypes = ReturnType<
  typeof setModalOpen | typeof addRedditThreadTracker | typeof addStockTracker
>;

export const actions = {
  setModalOpen,
  addRedditThreadTracker,
  addStockTracker,
};
