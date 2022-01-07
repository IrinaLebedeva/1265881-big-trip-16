import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * @param {Number} number
 * @returns {String}
 */
const formatNumberInTwoDigits = (number) => (number > 9) ? number : `0${number}`;

const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom), 'milliseconds');

/**
 * @param {Number} diffInMilliseconds
 * @returns {`${string}H ${string}M`|`${string}D ${string}H ${string}M`|`${string}M`}
 */
const getFormattedDuration = (diffInMilliseconds) => {
  const datesDiffDuration = dayjs.duration(diffInMilliseconds);
  const formattedDiff = [];
  if (datesDiffDuration.days() > 0) {
    formattedDiff.push(`${formatNumberInTwoDigits(datesDiffDuration.days())}D`);
  }
  formattedDiff.push(`${formatNumberInTwoDigits(datesDiffDuration.hours())}H`);
  formattedDiff.push(`${formatNumberInTwoDigits(datesDiffDuration.minutes())}M`);

  return formattedDiff.join(' ');
};

/**
 * @param {Date} dateFrom
 * @param {Date} dateTo
 * @returns {`${string}D ${string}H ${string}M`|`${string}H ${string}M`|`${string}M`}
 */
const getFormattedDatesDiff = (dateFrom, dateTo) => getFormattedDuration(getDuration(dateFrom, dateTo));

export {
  getDuration,
  getFormattedDatesDiff,
  getFormattedDuration,
};
