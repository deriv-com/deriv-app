export function calculateTotalByKey<T>(items: T[], key: keyof T): string {
    return items
        .reduce((acc, cur) => {
            let value = 0;
            const fieldValue = cur[key];
            if (typeof fieldValue === 'number') {
                value = fieldValue;
            } else if (typeof fieldValue === 'string') {
                const parsedValue = parseFloat(fieldValue);
                if (!isNaN(parsedValue)) {
                    value = parsedValue;
                }
            }
            return acc + value;
        }, 0)
        .toFixed(2);
}
