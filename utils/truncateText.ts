/**
 * Truncates text to a specified maximum length and adds an ellipsis if needed.
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the text (default: 100)
 * @param ellipsis - String to append when text is truncated (default: '...')
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 100, ellipsis: string = '...'): string {
    if (!text) return '';
    
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.slice(0, maxLength) + ellipsis;
}