import dayjs from 'dayjs';

const sortPointsByDateDesc = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortPointsByPriceDesc = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortPointsByTimeDesc = (pointA, pointB) => {
  const pointADiffInMinutes = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom), 'minute');
  const pointBDiffInMinutes = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom), 'minute');
  return pointBDiffInMinutes - pointADiffInMinutes;
};

export {
  sortPointsByDateDesc,
  sortPointsByPriceDesc,
  sortPointsByTimeDesc,
};
