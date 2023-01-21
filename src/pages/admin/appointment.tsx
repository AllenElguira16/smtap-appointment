import { Appointment, AppointmentFormInput } from '@/components';
import { useDomReady } from '@/hooks';
import { AdminLayout } from '@/layouts';
import { alertState } from '@/state';
import { AppointmentForm, AppointmentType } from '@/types';
import { formatDate, trpc } from '@/utils';
import { AppointmentEnum, User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Portal } from 'react-portal';
import { useSetRecoilState } from 'recoil';

const formInput = <T extends AppointmentType>(type: T) => {
  if (type === 'wedding') {
    return [
      {
        id: 'bride_name',
        name: 'brideName',
        label: "Bride's Full Name",
        placeholder: 'Jane Doe',
      },
      {
        id: 'groom_name',
        name: 'groomName',
        label: "Groom's Full Name",
        placeholder: 'John Doe',
      },
      {
        id: 'email',
        name: 'email',
        label: 'E-mail Address',
        placeholder: 'johndoe@email.com',
      },
      {
        id: 'phone_number',
        name: 'phone',
        label: 'Phone Number',
        placeholder: '09xx-xxx-xxxx',
      },
    ] as AppointmentFormInput<AppointmentForm<T>>[];
  }
  if (type === 'baptism' || type === 'burial' || type === 'others') {
    return [
      {
        id: 'name',
        name: 'name',
        label: type === 'others' ? 'Service Name' : 'Full Name',
        placeholder: 'John Doe',
      },
      {
        id: 'email',
        name: 'email',
        label: 'E-mail Address',
        placeholder: 'johndoe@email.com',
      },
      {
        id: 'phone_number',
        name: 'phone',
        label: 'Phone Number',
        placeholder: '09xx-xxx-xxxx',
      },
    ] as AppointmentFormInput<AppointmentForm<T>>[];
  }
  throw Error('An Error Occurred');
};

function AppointmentModal({ appointment }: AppointmentModalProps) {
  const { refetch } = trpc.appointment.getUserAppointment.useQuery(undefined, {
    enabled: false,
  });
  const updateMutation = trpc.appointment.update.useMutation();
  const [select, setSelect] = useState<AppointmentType>(
    appointment.type.toLocaleLowerCase() as AppointmentType,
  );

  const defaultValues = <T extends AppointmentType>(type: T) => {
    if (type === 'wedding') {
      return {
        brideName: appointment.info.brideName,
        groomName: appointment.info.groomName,
        phone: appointment.info.phone,
        email: appointment.info.email,
        date: formatDate(appointment.date),
      };
    }
    if (type === 'baptism' || type === 'burial' || type === 'others') {
      return {
        name: appointment.info.name,
        phone: appointment.info.phone,
        email: appointment.info.email,
        date: formatDate(appointment.date),
      };
    }
    throw Error('An Error Occurred');
  };

  const handleSelect = (newSelect: AppointmentType) => {
    setSelect(newSelect);
  };

  const onSubmit: SubmitHandler<AppointmentForm<typeof select>> = async (
    data,
  ) => {
    await updateMutation.mutateAsync({
      id: appointment.id,
      appointment: data,
      type: select,
    });

    await refetch();
  };

  return (
    <Appointment
      defaultValues={defaultValues(select)}
      formInput={formInput}
      onSelect={handleSelect}
      onSubmit={onSubmit}
      select={select}
      isSelectDisabled
    />
  );
}

export default function AppointmentPage() {
  const isDom = useDomReady();
  const setAlert = useSetRecoilState(alertState);
  const { data, refetch } = trpc.appointment.getAll.useQuery();
  const deleteMutation = trpc.appointment.delete.useMutation();
  const setAsApprovedMutation = trpc.appointment.setAsApproved.useMutation();

  const handleDelete = (id: string) => async () => {
    const { status, message } = await deleteMutation.mutateAsync(id);

    if (status) {
      setAlert({ isOpen: true, message, type: 'success' });
      await refetch();
    }
  };

  const handleApprove = (id: string) => async () => {
    const { status, message } = await setAsApprovedMutation.mutateAsync(id);

    if (status) {
      setAlert({ isOpen: true, message, type: 'success' });
      await refetch();
    }
  };

  if (!data) return null;

  const { appointments } = data;

  return (
    <AdminLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Appointments</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Client&apos;s Full Name</th>
                  <th>Appointment Type</th>
                  <th>Date of Appointment</th>
                  <th>Approved</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {appointments?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="font-bold text-center">
                      Empty huh?
                    </td>
                  </tr>
                )}
                {appointments?.map((appointment, key) => (
                  <tr className="hover" key={nanoid()}>
                    <th className="leading-4">
                      <div>{appointment.user.name}</div>
                      <small className="text-gray-500">
                        {appointment.user.email}
                      </small>
                    </th>
                    <td>{appointment.type}</td>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.approved ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="flex gap-2">
                        <label
                          htmlFor={`appointment-modal-${key}`}
                          className="btn btn-info"
                        >
                          <i className="material-icons">edit</i>
                        </label>
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={handleDelete(appointment.id)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleApprove(appointment.id)}
                        >
                          <i className="material-icons">recommend</i>
                        </button>
                      </div>
                      {isDom && (
                        <Portal>
                          <input
                            type="checkbox"
                            id={`appointment-modal-${key}`}
                            className="modal-toggle"
                          />
                          <div className="modal">
                            <div className="modal-box relative max-w-7xl">
                              <label
                                htmlFor={`appointment-modal-${key}`}
                                className="btn btn-sm btn-circle absolute right-2 top-2"
                              >
                                ✕
                              </label>
                              <AppointmentModal appointment={appointment} />
                            </div>
                          </div>
                        </Portal>
                      )}
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

type AppointmentModalProps = {
  appointment: {
    type: AppointmentEnum;
    id: string;
    createdAt: Date;
    user: User;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any;
    date: Date;
    paid: boolean;
    approved: boolean;
  };
};
