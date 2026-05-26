import { ROOM_TYPE } from '@/features/admin/cinemas/constants/cinemaConstants';

export const DAY_TYPE = {
  WEEKDAY: 'WEEKDAY',
  WEEKEND: 'WEEKEND',
};

export const DEFAULT_TICKET_PRICES = {
  [ROOM_TYPE.STANDARD]: {
    [DAY_TYPE.WEEKDAY]: 65000,
    [DAY_TYPE.WEEKEND]: 90000,
  },
  [ROOM_TYPE.COUPLE]: {
    [DAY_TYPE.WEEKDAY]: 80000,
    [DAY_TYPE.WEEKEND]: 110000,
  },
  [ROOM_TYPE.VIP]: {
    [DAY_TYPE.WEEKDAY]: 90000,
    [DAY_TYPE.WEEKEND]: 120000,
  },
  [ROOM_TYPE.IMAX]: {
    [DAY_TYPE.WEEKDAY]: 80000,
    [DAY_TYPE.WEEKEND]: 110000,
  },
};

