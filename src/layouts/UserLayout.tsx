import { NavLink } from '@/components';
import { trpc } from '@/utils';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { CommonLayout } from './CommonLayout';

export function UserLayout({ children }: PropsWithChildren) {
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
            <NavLink className="font-bold" href="/user/appointment">
              <i className="material-icons">book_online</i>
              <small className="font-bold">Set Appointment</small>
            </NavLink>
          </li>
          <li>
            <NavLink href="/user/appointment-history">
              <i className="material-icons">dashboard</i>
              <small className="font-bold">Appointment History</small>
            </NavLink>
          </li>
          <li>
            <NavLink href="/user/transaction-history">
              <i className="material-icons">manage_history</i>
              <small className="font-bold">Transaction History</small>
            </NavLink>
          </li>
          <li className="menu-title">
            <span>Account Pages</span>
          </li>
          <li>
            <NavLink href="/user/profile">
              <i className="material-icons">manage_accounts</i>
              <small className="font-bold">User Profile</small>
            </NavLink>
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
