import { format, parse, addMonths, subMonths, isValid } from 'date-fns';

export const formatDate = (date: Date | string) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date | string) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return format(parsedDate, 'MMMM d, yyyy');
};

export const parseISODate = (dateString: string) => {
  const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
  return isValid(parsedDate) ? parsedDate : new Date();
};

export const getNextMonth = (date: Date) => {
  return addMonths(date, 1);
};

export const getPreviousMonth = (date: Date) => {
  return subMonths(date, 1);
};

export const getMonthRange = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};
