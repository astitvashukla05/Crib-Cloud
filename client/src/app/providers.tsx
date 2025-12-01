'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import { Authenticator } from '@aws-amplify/ui-react';
import Auth from './(auth)/authProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </Provider>
  );
}
