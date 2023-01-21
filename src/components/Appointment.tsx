import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { appointmentSchema } from '@/schema';
import { AppointmentForm, AppointmentType } from '@/types';
import { nanoid } from 'nanoid';

export function Appointment({
  formInput,
  select,
  onSelect,
  onSubmit,
  defaultValues,
  isSelectDisabled = false,
}: AppointmentProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentForm<typeof select>>({
    resolver: zodResolver(appointmentSchema(select)),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-body grid gap-4">
      <div className="card-title">
        <h2>Set Appointment</h2>
        <select
          value={select}
          onChange={(e) => onSelect(e.currentTarget.value as AppointmentType)}
          className="select select-bordered w-full max-w-xs"
          disabled={isSelectDisabled}
        >
          <option disabled hidden value="" defaultValue="">
            Choose your appointment
          </option>
          <option value="wedding">Wedding</option>
          <option value="baptism">Baptismal</option>
          <option value="burial">Burial</option>
          <option value="others">Other Services</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {formInput(select).map((form) => (
          <div key={nanoid()}>
            <label htmlFor={form.id} className="text-xs">
              {form.label}
            </label>
            <input
              type="text"
              id={form.id}
              placeholder={form.placeholder}
              className={`input input-bordered w-full${
                errors[form.name] ? ' input-error' : ''
              }`}
              {...register(form.name)}
            />
            <small className="text-error">{errors[form.name]?.message}</small>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="appointment_date" className="text-xs">
          Target Date of Appointment
        </label>
        <input
          type="date"
          id="appointment_date"
          className={`input input-bordered w-full${
            errors.date ? ' input-error' : ''
          }`}
          {...register('date')}
        />
        <small className="text-error">{errors.date?.message}</small>
      </div>
      <button type="submit" className="btn btn-primary">
        {isSelectDisabled ? 'Update' : 'Proceed to Payment'}
      </button>
    </form>
  );
}

export type AppointmentFormInput<T> = {
  id: string;
  name: keyof T;
  label: string;
  placeholder: string;
};

type AppointmentProps = {
  defaultValues?: AppointmentForm<AppointmentType>;
  formInput: <T extends AppointmentType>(
    type: T,
  ) => AppointmentFormInput<AppointmentForm<T>>[];
  select: AppointmentType;
  onSelect: (newSelect: AppointmentType) => void;
  onSubmit: SubmitHandler<AppointmentForm<AppointmentType>>;
  isSelectDisabled?: boolean;
};
