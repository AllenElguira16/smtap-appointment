import { trpc } from '@/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { CommonLayout } from './CommonLayout';

export function AdminLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const logoutMutation = trpc.user.logout.useMutation();

  const handleSignOut = async () => {
    const { status } = await logoutMutation.mutateAsync();

    if (status) router.replace('/');
  };

  return (
    <CommonLayout
      nav={
        <ul className="menu p-2">
          <li>
            <Link href="/admin/dashboard">
              <i className="material-icons">dashboard</i>
              <small className="font-bold">Dashboard</small>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <i className="material-icons">person_add</i>
              <small className="font-bold">Users</small>
            </Link>
          </li>
          {/* NEEDS CLARIFICATION */}
          {/* <li>
            <Link href="/admin/billing">
              <i className="material-icons">credit_card</i>
              <small className="font-bold">Billing</small>
            </Link>
          </li> */}
          <li>
            <Link href="/admin/appointment">
              <i className="material-icons">diversity_3</i>
              <small className="font-bold">Appointments</small>
            </Link>
          </li>
          <li className="menu-title">
            <span>Profile</span>
          </li>
          <li>
            <Link href="/admin/profile">
              <i className="material-icons">manage_accounts</i>
              <small className="font-bold">User Profile</small>
            </Link>
          </li>
          <li>
            <button type="button" onClick={handleSignOut}>
              <i className="material-icons">logout</i>
              <small className="font-bold">Sign Out</small>
            </button>
          </li>
        </ul>
      }
    >
      {children}
    </CommonLayout>
  );
}
