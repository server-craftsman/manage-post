export const formatDate = (date: Date | null): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'N/A'; // Check for invalid date
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateForTable = (dateString: string | null): string => {
  if (!dateString) {
    return 'N/A'; // Check for null or undefined date
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'N/A'; // Check for invalid date
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
