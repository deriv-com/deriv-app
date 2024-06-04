export default function customFormatShortWeekday(_locale: string | undefined, date: Date) {
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return weekdays[date.getDay()];
}
