import { UserLayout } from '@/layouts';
import { useCallback, useEffect, useState } from 'react';
import paymaya from 'paymaya-js-sdk';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppointmentType, AppointmentForm } from '@/types';
import { SubmitHandler } from 'react-hook-form';
import { trpc } from '@/utils';
import { Appointment, AppointmentFormInput } from '@/components';

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

export default function AppointmentPage() {
  const router = useRouter();
  const [select, setSelect] = useState<AppointmentType>('wedding');
  const referenceId = Math.floor(100000000 + Math.random() * 900000000);
  const setAppointmentMutation = trpc.appointment.setAppointment.useMutation();
  const setAsPaid = trpc.appointment.setAsPaid.useMutation();

  const handleSelect = (newSelect: AppointmentType) => {
    setSelect(newSelect);
  };

  const onSubmit: SubmitHandler<AppointmentForm<typeof select>> = async (
    data,
  ) => {
    const { appointment } = await setAppointmentMutation.mutateAsync({
      type: select,
      appointment: data,
    });

    if (!appointment) return;

    paymaya.createCheckout({
      totalAmount: {
        value: 500,
        currency: 'PHP',
      },
      items: [
        {
          name: 'St. Michael Parish - Appointment System',
          quantity: 1,
          code: 'CVG-096732',
          description: 'Appointment',
          amount: {
            value: 500,
          },
          totalAmount: {
            value: 500,
            details: {
              discount: 0,
              serviceCharge: 0,
              shippingFee: 0,
              tax: 0,
              subtotal: 500,
            },
          },
        },
      ],
      redirectUrl: {
        success: `${window.location.origin}/user/appointment?success=true&appointment_id=${appointment.id}`,
        failure: `${window.location.origin}/user/appointment?success=false`,
      },
      requestReferenceNumber: referenceId.toString(),
      metadata: {},
    });
  };

  useEffect(() => {
    // cspell:disable-next-line
    paymaya.init('pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah', true);
  }, []);

  const update = useCallback(async () => {
    if (
      router.query.appointment_id &&
      typeof router.query.appointment_id === 'string'
    ) {
      await setAsPaid.mutateAsync(router.query.appointment_id);
    }
  }, [router.query.appointment_id, setAsPaid]);

  useEffect(() => {
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserLayout>
      {router.query.success === 'false' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body grid gap-4">An error occurred</div>
        </div>
      )}
      {router.query.success === 'true' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body grid gap-4">
            Payment Successful, <Link href="/user/appointment">Go back</Link>
          </div>
        </div>
      )}
      {!router.query.success && (
        <div className="card bg-base-100 shadow-xl">
          <Appointment
            formInput={formInput}
            onSelect={handleSelect}
            onSubmit={onSubmit}
            select={select}
          />
        </div>
      )}
    </UserLayout>
  );
}
