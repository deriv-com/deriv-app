export default function unixToDateString(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000);

    //ensure that the day and month always have two digits.
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}
