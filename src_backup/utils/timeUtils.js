export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

export const roundToNearestIncrement = (minutes, increment = 6) => {
  return Math.ceil(minutes / increment) * increment;
};

export const calculateBillableAmount = (duration, rate) => {
  const hours = duration / 3600; // Convert seconds to hours
  return (Math.round(hours * 100) / 100) * rate;
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}; 