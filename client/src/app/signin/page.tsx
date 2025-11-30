'use client';

import Auth from '../(auth)/authProvider';
import { Authenticator } from '@aws-amplify/ui-react';
export default function SignInPage() {
  return (
    <Authenticator.Provider>
      <Auth>{null}</Auth>
    </Authenticator.Provider>
  );
}
