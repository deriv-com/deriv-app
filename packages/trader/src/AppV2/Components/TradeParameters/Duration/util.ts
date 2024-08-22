export const getOptionPerUnit = (unit: string) => {
    let start = 0;
    let end = 0;
    let label = '';

    const generateOptions = (start: number, end: number, label: string) => {
        return Array.from({ length: end - start + 1 }, (_, i) => ({
            value: start + i,
            label: `${start + i} ${label}`,
        }));
    };

    switch (unit) {
        case 'm':
            start = 1;
            end = 59;
            label = 'min';
            break;
        case 's':
            start = 15;
            end = 59;
            label = 'sec';
            break;
        case 'd':
            start = 1;
            end = 365;
            label = 'days';
            break;
        case 't':
            start = 1;
            end = 10;
            label = 'tick';
            break;
        case 'h': {
            const hourOptions = generateOptions(1, 23, 'h');
            const minuteOptions = generateOptions(1, 59, 'min');
            return [hourOptions, minuteOptions];
        }
        default:
            return [];
    }

    return generateOptions(start, end, label);
};
