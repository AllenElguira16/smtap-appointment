import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { EditForm as TEditForm } from '@/types';
import { Portal } from 'react-portal';
import { useDomReady } from '@/hooks';
import { User } from '@prisma/client';
import { editSchema } from '@/schema';
import { alertState } from '@/state';
import { trpc } from '@/utils';

export function EditForm({ defaultValues }: { defaultValues: TEditForm }) {
  const { refetch } = trpc.user.getAll.useQuery();
  const setAlert = useSetRecoilState(alertState);

  const editMutation = trpc.user.edit.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TEditForm>({
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

  const onSubmit: SubmitHandler<TEditForm> = async (data) => {
    const { status, message } = await editMutation.mutateAsync(data);

    await refetch();
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
        Update
      </button>
    </form>
  );
}

export function EditModal({ user }: { user: Omit<User, 'password'> }) {
  const isDomReady = useDomReady();

  if (!isDomReady) return null;
  return (
    <Portal>
      <input type="checkbox" id="edit-profile-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor="edit-profile-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <EditForm
            defaultValues={{
              ...user,
              password: '',
            }}
          />
        </div>
      </div>
    </Portal>
  );
}
