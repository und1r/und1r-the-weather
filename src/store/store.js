import { configureStore } from '@reduxjs/toolkit';

import { coordApi } from '../services/coordApi';

export default configureStore({
  reducer: {
    [coordApi.reducerPath]: coordApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(coordApi.middleware),
});
