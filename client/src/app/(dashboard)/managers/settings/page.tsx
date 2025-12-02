'use client';

import SettingsForm from '@/components/SettingsForm';
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from '@/state/api';
import React from 'react';

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();

  const [updateTenant] = useUpdateManagerSettingsMutation();
  console.log(authUser);
  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authUser?.userInfo.data.name,
    email: authUser?.userInfo.data.email,
    phoneNumber: authUser?.userInfo.data.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
      cognitoId: authUser?.cognitoInfo?.userId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
};

export default TenantSettings;
