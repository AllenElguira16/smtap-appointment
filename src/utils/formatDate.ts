import { DateTime } from 'luxon';

export const formatDate = (date: Date) =>
  DateTime.fromISO(new Date(date).toISOString()).toFormat('yyyy-MM-dd');
