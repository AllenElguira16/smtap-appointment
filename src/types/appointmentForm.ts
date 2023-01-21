export type AppointmentType = 'wedding' | 'burial' | 'baptism' | 'others';

export type WeddingAppointmentForm = {
  brideName: string;
  groomName: string;
  email: string;
  phone: string;
  date: string;
};

export type BurialAppointmentForm = {
  name: string;
  email: string;
  phone: string;
  date: string;
};

export type BaptismAppointmentForm = {
  name: string;
  email: string;
  phone: string;
  date: string;
};

export type OtherAppointmentForm = {
  name: string;
  email: string;
  phone: string;
  date: string;
};

export type AppointmentForm<Type extends AppointmentType> =
  Type extends 'wedding'
    ? WeddingAppointmentForm
    : Type extends 'burial'
    ? BurialAppointmentForm
    : Type extends 'baptism'
    ? BaptismAppointmentForm
    : Type extends 'others'
    ? OtherAppointmentForm
    : unknown;
