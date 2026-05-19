export function formatDate(dateInput, locale = 'vi-VN') {
  if (!dateInput) {
    return '';
  }

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export default formatDate;
