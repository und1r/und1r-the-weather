import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const coordApi = createApi({
  reducerPath: 'coordApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://api.open-notify.org' }),
  endpoints: (builder) => ({
    getISSLocation: builder.query({
      query: () => 'iss-now.json',
    }),
  }),
});

export const {
  useGetISSLocationQuery,
} = coordApi;
