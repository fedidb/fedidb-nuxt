export function formatDate(isoString, options = {}) {
    if (!isoString) return 'Unknown date';
    
    const defaultOptions = {
      includeTime: false,
      relative: false,
      shortFormat: false
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
      const date = new Date(isoString);
      
      // Check if date is invalid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // For relative time format
      if (config.relative) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        // Just now (less than 1 minute ago)
        if (diffInSeconds < 60) {
          return 'just now';
        }
        
        // Minutes ago (less than 1 hour)
        if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        }
        
        // Hours ago (less than 1 day)
        if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        }
        
        // Days ago (less than 1 week)
        if (diffInSeconds < 604800) {
          const days = Math.floor(diffInSeconds / 86400);
          return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        }
        
        // Weeks ago (less than 1 month)
        if (diffInSeconds < 2592000) {
          const weeks = Math.floor(diffInSeconds / 604800);
          return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        }
        
        // Months ago (less than 1 year)
        if (diffInSeconds < 31536000) {
          const months = Math.floor(diffInSeconds / 2592000);
          return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        }
        
        // Years ago
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
      }
      
      // For absolute time format
      const months = config.shortFormat 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      // Format date part
      let formatted = `${month} ${day}, ${year}`;
      
      // Add time if requested
      if (config.includeTime) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        
        formatted += ` at ${hours}:${minutes} ${ampm}`;
      }
      
      return formatted;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error formatting date';
    }
  };