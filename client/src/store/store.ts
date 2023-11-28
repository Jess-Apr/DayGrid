import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modal/modalSlice";
import menuModalReducer from "./modal/menuModalSlice";
import diaryReducer from "./diary/diarySlice";
import calendarReducer from "./modal/calendarSlice";
import editingDiaryReducer from "./diary/editingDiarySlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    menuModal: menuModalReducer,
    diaryId: diaryReducer,
    currentDate: calendarReducer,
    calendarType: calendarReducer,
    editingDiary: editingDiaryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
