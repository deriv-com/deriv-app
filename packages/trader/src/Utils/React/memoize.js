export function memoize(func) {
    const cache = {};
    return function (...args) {
        const key = JSON.stringify(args);
        if (key in cache) return cache[key];
        return (cache[key] = func(...args));
    };
}
