export function formatNumber(num) {
    num = Number(num);
    
    if (isNaN(num)) {
        return '0';
    }
    
    if (!num) {
        return '0';
    }
    
    const absNum = Math.abs(num);
    
    let formattedNum;
    if (absNum >= 1000000000) {
        formattedNum = (absNum / 1000000000).toFixed(1) + 'B';
    } else if (absNum >= 1000000) {
        formattedNum = (absNum / 1000000).toFixed(1) + 'M';
    } else if (absNum >= 1000) {
        formattedNum = (absNum / 1000).toFixed(1) + 'K';
    } else {
        formattedNum = absNum.toString();
    }
    
    return num < 0 ? '-' + formattedNum : formattedNum;
}