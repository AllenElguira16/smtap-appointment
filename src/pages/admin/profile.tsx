import { AdminLayout } from '@/layouts';
import { trpc } from '@/utils';
import { EditModal } from '@/components';

export default function Profile() {
  const { data } = trpc.user.getUser.useQuery();

  if (!data || !data.user) return null;

  const { user } = data;

  return (
    <AdminLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <header className="flex justify-between">
            <div>
              <div className="card-title">{user.name}</div>
              <small className="block">{user.email}</small>
            </div>
            <label
              htmlFor="edit-profile-modal"
              className="btn btn-sm text-white btn-error"
            >
              <i className="material-icons">edit</i>
              <div>Edit Profile</div>
            </label>
          </header>
          <div>
            <div className="font-bold">Full Name:</div>
            <div>{user.name}</div>
          </div>
          <div>
            <div className="font-bold">Email:</div>
            <div>{user.email}</div>
          </div>
          <div>
            <div className="font-bold">Address:</div>
            <div>{user.address}</div>
          </div>
        </div>
      </div>
      <EditModal user={user} />
    </AdminLayout>
  );
}
