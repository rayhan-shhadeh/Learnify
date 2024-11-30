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

// Example usage
const startDate = "2024-11-01";
const endDate = "2024-11-05";
const dates = generateDateArray(startDate, endDate);
console.log(dates);
