'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import Auth from '../(auth)/authProvider';

export default function SignUpPage() {
  return (
    <Authenticator.Provider>
      <Auth>{null}</Auth>
    </Authenticator.Provider>
  );
}
