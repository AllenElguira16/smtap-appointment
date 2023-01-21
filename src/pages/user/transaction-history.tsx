import { UserLayout } from '@/layouts';
import { formatDate, trpc } from '@/utils';
import { nanoid } from 'nanoid';

export default function TransactionHistory() {
  const { data } = trpc.appointment.getUserAppointment.useQuery();

  if (!data) return null;

  const { appointments } = data;

  return (
    <UserLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Appointment</th>
                  <th>Date of Payment</th>
                  <th>Transaction Number</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {appointments?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="font-bold text-center">
                      Empty huh?
                    </td>
                  </tr>
                )}
                {appointments?.map((appointment) => (
                  <tr className="hover" key={nanoid()}>
                    <td>{appointment.type}</td>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.id}</td>
                    <td>
                      <i className="material-icons">delete</i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
