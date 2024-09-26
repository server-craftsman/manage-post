export const formatDate = (date: Date | null): string => {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
