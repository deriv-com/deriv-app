export default function unixToDateString(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

export function customFormatShortWeekday(_locale: string | undefined, date: Date) {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return weekdays[date.getDay()];
}
