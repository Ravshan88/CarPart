import {call, put, takeLatest} from "redux-saga/effects";
import instance from "../../components/utils/config/instance";

import {
    saveAdmin,
    deleteAdmin,
    setError,
    addAdmin,
    setAdminData,
    getAdminData, editAdmin, setIsEditing,// Import the setAdminData action
} from "../reducers/AdminAdminSlice";
import {toast} from "react-toastify";

function* getAdminDataAsync() {
    try {
        const response = yield call(() => instance("/api/v1/auth/admin", "GET"));

        yield put(setAdminData(response.data));
    } catch (error) {
        yield put(setError(error.message));
    }
}

function* saveAdminAsync(action) {
    try {
        const {formData, isEditing} = action.payload
        if (!isEditing.editing) {
            yield call(() => instance("/api/v1/auth/register/admin", "POST", formData));
        } else {
            yield call(() => instance('/api/v1/auth/user/' + isEditing.id, 'PUT', formData))
        }
        yield put(getAdminData())
        yield put(setIsEditing(false))

    } catch (error) {
        yield put(setError(error.message));
        toast.error("Siz xato malumot qo'shdingiz")
    }
}

// function* editAdminAsync(action) {
//     try {
//         const id = action.payload.id;
//         const response = yield call(() => instance('/api/v1/auth/user/' + id, 'PUT', action.payload.data))
//         yield put(getAdminData())
//     } catch (error) {
//         yield put(setError(error.message))
//     }
// }

function* deleteAdminAsync(action) {
    try {
        const adminId = action.payload;
        yield instance(`/api/v1/auth/user/${adminId}`, "DELETE");
        yield put(getAdminData())


    } catch (error) {
        yield put(setError(error.message));
    }
}


export function* adminAdminSaga() {
    yield takeLatest(saveAdmin, saveAdminAsync);
    yield takeLatest(deleteAdmin, deleteAdminAsync);
    yield takeLatest(addAdmin, saveAdminAsync);
    yield takeLatest(getAdminData, getAdminDataAsync);
}
