import { createNewUserInDatabase } from '@/lib/utils';
import { Manager, Tenant } from '@/types/prismaTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set('Authorization', `Bearer ${idToken}`);
      }
      return headers;
    },
  }),

  reducerPath: 'api',
  tagTypes: ['Managers', 'Tenants'],

  endpoints: (build) => ({
    // ---------------------------------------------------------
    // GET AUTH USER
    // ---------------------------------------------------------
    getAuthUser: build.query<User, void>({
      queryFn: async (_, _api, _options, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload['custom:role'] as string;

          const endpoint =
            userRole === 'manager'
              ? `managers/${user.userId}`
              : `tenants/${user.userId}`;

          let userDetailsRes = await fetchWithBQ(endpoint);

          // create if not exists
          if (userDetailsRes.error && userDetailsRes.error.status === 404) {
            userDetailsRes = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBQ
            );
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsRes.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error: any) {
          return { error: error.message || 'Could not fetch user data' };
        }
      },
    }),

    // ---------------------------------------------------------
    // UPDATE TENANT SETTINGS
    // ---------------------------------------------------------
    updateTenantSetting: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...update }) => ({
        url: `tenants/${cognitoId}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Tenants'],
    }),

    // ---------------------------------------------------------
    // UPDATE MANAGER SETTINGS
    // ---------------------------------------------------------
    updateManagerSetting: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...update }) => ({
        url: `managers/${cognitoId}`,
        method: 'PUT',
        body: update,
      }),
      invalidatesTags: ['Managers'],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingMutation,
  useUpdateManagerSettingMutation,
} = api;
