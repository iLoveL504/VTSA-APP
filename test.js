import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

console.log(dayjs().tz('Asia/Manila').startOf('day').format('YYYY-MM-DD'))

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); 
    return d;
  };

  console.log(normalizeDate(new Date()))

  console.log(dayjs.utc('2025-11-24').format('YYYY-MM-DD'))