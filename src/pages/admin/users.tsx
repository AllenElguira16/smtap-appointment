import { EditModal } from '@/components';
import { AdminLayout } from '@/layouts';
import { alertState } from '@/state';
import { formatDate, trpc } from '@/utils';
import { nanoid } from 'nanoid';
import { useSetRecoilState } from 'recoil';

export default function Users() {
  const { data: users, refetch } = trpc.user.getAll.useQuery();

  const setAlert = useSetRecoilState(alertState);
  const deleteMutation = trpc.user.delete.useMutation();

  const handleDeleteUser = (id: string) => async () => {
    const { status, message } = await deleteMutation.mutateAsync(id);

    if (status) {
      setAlert({ isOpen: true, message, type: 'success' });
      await refetch();
    }
  };

  return (
    <AdminLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Users</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Address</th>
                  <th>Date of Created</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr className="hover" key={nanoid()}>
                    <th className="leading-4">
                      <div>{user.name}</div>
                      <small className="text-gray-500">{user.email}</small>
                    </th>
                    <td>{user.address}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        <label
                          htmlFor="edit-profile-modal"
                          className="btn btn-info"
                        >
                          <i className="material-icons">edit</i>
                        </label>
                        <EditModal user={user} />
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={handleDeleteUser(user.id)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
