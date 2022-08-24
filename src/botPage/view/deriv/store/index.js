import { configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-named-as-default
import clientSlice from './client-slice';
// eslint-disable-next-line import/no-named-as-default
import uiSlice from './ui-slice';

export default configureStore({
    reducer: {
        client: clientSlice,
        ui: uiSlice,
    },
});
