import {configureStore} from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import qrSlice from './slices/qrSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        qr: qrSlice
    }
})