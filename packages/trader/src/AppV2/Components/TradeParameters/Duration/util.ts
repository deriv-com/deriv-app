export const getOptionPerUnit = (unit: string) => {
    const options = [];
    const hourOptions = [];
    let start = 0;
    let end = 0;
    let label = '';
    if (unit === 'm') {
        start = 1;
        end = 59;
        label = 'min';
    }
    if (unit === 's') {
        start = 15;
        end = 59;
        label = 'sec';
    }
    if (unit === 'd') {
        start = 1;
        end = 365;
        label = 'days';
    }

    if (unit === 't') {
        start = 1;
        end = 10;
        label = 'tick';
    }

    if (unit === 'h') {
        start = 15;
        end = 59;
        label = 'days';
        for (let index = start; index <= end; index++) {
            hourOptions.push({ value: index });
        }
        start = 1;
        end = 24;
    }
    for (let index = start; index <= end; index++) {
        options.push({ value: index, label: `${index} ${label}` });
    }

    return options;
};
