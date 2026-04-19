/**
 * Formats a duration in milliseconds into a human-readable string.
 * Example: 1560 minutes -> 1day 2hrs 0mins 0secs
 * @param {number} ms - Duration in milliseconds
 * @returns {string} - Formatted string
 */
export const formatDuration = (ms) => {
  if (ms === null || ms === undefined || ms < 0) return '0secs';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}day${days > 1 ? 's' : ''}`);
  if (hours > 0 || days > 0) parts.push(`${hours}hr${hours !== 1 ? 's' : ''}`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}min${minutes !== 1 ? 's' : ''}`);
  parts.push(`${seconds}sec${seconds !== 1 ? 's' : ''}`);

  return parts.join(' ');
};
