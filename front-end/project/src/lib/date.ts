import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale('es');

export const TIMEZONE = 'America/Guayaquil';

export const formatDate = (date: string | Date, format = 'DD/MM/YYYY'): string => {
  return dayjs(date).tz(TIMEZONE).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).tz(TIMEZONE).format('DD/MM/YYYY HH:mm');
};

export const formatTime = (date: string | Date): string => {
  return dayjs(date).tz(TIMEZONE).format('HH:mm');
};

export const toISO = (date: string, time: string): string => {
  const dateTime = `${date} ${time}`;
  return dayjs.tz(dateTime, 'YYYY-MM-DD HH:mm', TIMEZONE).toISOString();
};

export const fromISO = (isoString: string): { date: string; time: string } => {
  const localDate = dayjs(isoString).tz(TIMEZONE);
  return {
    date: localDate.format('YYYY-MM-DD'),
    time: localDate.format('HH:mm')
  };
};

export const isValidDate = (dateString: string): boolean => {
  return dayjs(dateString, 'YYYY-MM-DD', true).isValid();
};

export const isValidTime = (timeString: string): boolean => {
  return dayjs(timeString, 'HH:mm', true).isValid();
};

export const isFutureDateTime = (date: string, time: string): boolean => {
  const dateTime = dayjs.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', TIMEZONE);
  return dateTime.isAfter(dayjs());
};

export const getTodayDate = (): string => {
  return dayjs().tz(TIMEZONE).format('YYYY-MM-DD');
};

export const specialtyLabels: Record<string, string> = {
  MEDICINA_GENERAL: 'Medicina General',
  PEDIATRIA: 'Pediatría',
  GINECOLOGIA: 'Ginecología',
  CARDIOLOGIA: 'Cardiología',
  DERMATOLOGIA: 'Dermatología',
  ODONTOLOGIA: 'Odontología',
  TRAUMATOLOGIA: 'Traumatología'
};

export const statusLabels: Record<string, string> = {
  SCHEDULED: 'Programada',
  RESCHEDULED: 'Reprogramada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada'
};