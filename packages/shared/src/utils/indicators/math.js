export const takeField = (arr, field) => arr.map(x => (field ? x[field] : x));

export const takeLast = (arr, n, field) => takeField(arr.slice(n > arr.length ? 0 : arr.length - n, arr.length), field);

export const sum = data => data.reduce((acc, x) => acc + x);

export const mean = data => data.reduce((a, b) => a + b) / data.length;

export const stddev = data => {
    const data_mean = mean(data);
    const sq_diff = data.map(n => Math.pow(n - data_mean, 2));
    const avg_sq_diff = mean(sq_diff);
    return Math.sqrt(avg_sq_diff);
};

export const slidingWindowMax = (data, periods, field) => {
    const vals = takeField(data, field);
    const n = vals.length - periods;
    const maxArray = [];

    for (let i = 0; i <= n; i++) {
        let max = vals[i];

        for (let j = 1; j < periods; j++) {
            if (vals[i + j] > max) max = vals[i + j];
        }
        maxArray.push(max);
    }
    return maxArray;
};

export const slidingWindowMin = (data, periods, field) => {
    const vals = takeField(data, field);
    const n = vals.length - periods;
    const minArray = [];

    for (let i = 0; i <= n; i++) {
        let min = vals[i];

        for (let j = 1; j < periods; j++) {
            if (vals[i + j] < min) min = vals[i + j];
        }
        minArray.push(min);
    }
    return minArray;
};
