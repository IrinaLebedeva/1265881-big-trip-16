import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const isFuturePoint = (point) => dayjs().isBefore(dayjs(point.dateFrom));

const isPastPoint = (point) => dayjs().isAfter(dayjs(point.dateTo));

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point)),
};

export {filter};
