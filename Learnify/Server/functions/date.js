export function generateDateArray(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
    while (start < end) {
        dateArray.push(start.toISOString()); // Format as YYYY-MM-DD
        start.setDate(start.getDate() + 1);
    }
    dateArray.push(end.toISOString());
    return dateArray;
}

export function differenceInDays(startDate, endDate) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    return diffInDays;
}
