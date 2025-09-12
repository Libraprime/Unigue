import { ReactNode } from 'react';
import FirebaseProvider from '../../components/FirebaseProvider';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
