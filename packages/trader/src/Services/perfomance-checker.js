function measurePerformance (end, start = 'start') {
    performance.measure(end, start, end);
    const differences = performance.getEntriesByType('measure');
    for (let i = 0; i < differences.length; i++) {
        // const time = Math.round(differences[i].startTime + differences[i].duration);
        // eslint-disable-next-line no-console
        console.log(`${JSON.stringify(differences[i])}: ${  JSON.stringify(differences[i].duration)}`);
    }

    // performance.clearMarks();
}
export {
    measurePerformance,
};
