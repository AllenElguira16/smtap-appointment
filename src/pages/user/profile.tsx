import { Portal } from 'react-portal';
import { UserLayout } from '@/layouts';
import { trpc } from '@/utils';
import { useDomReady } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { editSchema } from '@/schema';
import { alertState } from '@/state';
import { EditForm } from '@/types';

function Edit({ defaultValues }: { defaultValues: EditForm }) {
  const setAlert = useSetRecoilState(alertState);

  const editMutation = trpc.user.edit.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: defaultValues.id,
      address: defaultValues.address,
      email: defaultValues.email,
      gender: defaultValues.gender,
      name: defaultValues.name,
      password: defaultValues.password,
    },
  });

  const onSubmit: SubmitHandler<EditForm> = async (data) => {
    const { status, message } = await editMutation.mutateAsync(data);

    setAlert({
      message,
      isOpen: true,
      type: status ? 'success' : 'error',
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-body grid gap-4"
      autoComplete="new-password"
    >
      <h1 className="card-title">Edit Profile</h1>
      <input type="hidden" {...register('id')} />
      <div>
        <input
          type="text"
          placeholder="Name"
          className={`input input-bordered w-full ${
            errors.name ? ' input-error' : ''
          }`}
          autoComplete="off"
          {...register('name')}
        />
        <small className="text-error">{errors.name?.message}</small>
      </div>
      <div>
        <input
          type="text"
          placeholder="Email"
          autoComplete="off"
          className={`input input-bordered w-full ${
            errors.email ? ' input-error' : ''
          }`}
          {...register('email')}
        />
        <small className="text-error">{errors.email?.message}</small>
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          className={`input input-bordered w-full ${
            errors.password ? ' input-error' : ''
          }`}
          {...register('password')}
        />
        <small className="text-error">{errors.password?.message}</small>
      </div>
      <div>
        <input
          type="text"
          placeholder="Address"
          autoComplete="off"
          className={`input input-bordered w-full ${
            errors.address ? ' input-error' : ''
          }`}
          {...register('address')}
        />
        <small className="text-error">{errors.email?.message}</small>
      </div>
      <div className="w-full">
        <select
          className="select select-primary w-full"
          {...register('gender')}
        >
          <option disabled hidden value="">
            Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Sign Up
      </button>
    </form>
  );
}

export default function Profile() {
  const isDomReady = useDomReady();
  const { data } = trpc.user.getUser.useQuery();

  if (!data || !data.user) return null;

  const { user } = data;

  return (
    <UserLayout>
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
      {isDomReady && (
        <Portal>
          <input
            type="checkbox"
            id="edit-profile-modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <label
                htmlFor="edit-profile-modal"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <Edit
                defaultValues={{
                  ...user,
                  password: '',
                }}
              />
            </div>
          </div>
        </Portal>
      )}
    </UserLayout>
  );
}
