// import { BurialAppointmentForm, BaptismAppointmentForm, WeddingAppointmentForm, OtherAppointmentForm } from '@/types';
import { trpc } from '@/utils';
import { AppointmentEnum } from '@prisma/client';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
// import { AppointmentType } from '@/types';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: true,
      text: 'Appointment Statistics',
    },
  },
};

export function Charts() {
  const { data } = trpc.appointment.getAll.useQuery();

  if (!data || !data.appointments) return null;

  const { appointments } = data;

  const appointmentTypes: AppointmentEnum[] = [
    'BAPTISM',
    'BURIAL',
    'OTHERS',
    'WEDDING',
  ];
  const appointmentsData = appointmentTypes.map(
    (appointmentType) =>
      appointments.filter(({ type }) => type === appointmentType).length,
  );

  const pieChartData = {
    labels: appointmentTypes,
    datasets: [
      {
        label: '# of Donors',
        data: appointmentsData,
        backgroundColor: [
          'rgba(242, 23, 17, 0.2)',
          'rgba(171, 241, 131, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(242, 23, 17, 1)',
          'rgba(171, 241, 131, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const barChartColors = [
    'rgba(166, 2, 104, 0.3)',
    'rgba(184, 91, 22, 0.4)',
    'rgba(229, 247, 101, 0.5)',
    'rgba(105, 40, 220, 0.7)',
    'rgba(24, 45, 215, 0.9)',
    'rgba(196, 24, 238, 0.4)',
    'rgba(88, 158, 170, 0.3)',
    'rgba(136, 194, 133, 0.8)',
    'rgba(56, 221, 253, 1)',
    'rgba(213, 32, 111, 0.5)',
    'rgba(219, 190, 94, 0.2)',
    'rgba(18, 253, 146, 0.2)',
  ];

  const barChartDataSets = appointmentTypes.map(
    (appointmentType, bloodTypeIndex) => ({
      label: appointmentType,
      data: months.map((_, index) => {
        const monthNumber = index + 1;
        return appointments
          .filter(({ type }) => type === appointmentType)
          .filter(({ createdAt }) => {
            return new Date(createdAt).getMonth() === monthNumber;
          }).length;
      }),
      backgroundColor: barChartColors[bloodTypeIndex],
    }),
  );

  const barChartData = {
    labels: months,
    datasets: barChartDataSets,
  };

  return (
    <div className="flex justify-around">
      <div className="w-1/4">
        <Pie options={options} data={pieChartData} />
      </div>
      <div className="w-2/4">
        <Bar options={options} data={barChartData} />
      </div>
    </div>
  );
}
