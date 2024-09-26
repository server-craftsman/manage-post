export const formatDate = (date: Date | null): string => {
  if (!date || isNaN(date.getTime())) return 'N/A'; // Check for invalid date
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};