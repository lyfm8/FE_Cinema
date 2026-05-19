export function formatCurrency(value, currency = 'VND', locale = 'vi-VN') {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export default formatCurrency;
