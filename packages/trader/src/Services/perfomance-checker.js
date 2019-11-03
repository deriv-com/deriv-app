class PerformanceChecker {
    startChecking = () => {
        performance.measure('difference', 'start', 'set_proposal_info');
        const differences = performance.getEntriesByType('measure');
        for (let i = 0; i < differences.length; i++) {
            const time = Math.round(differences[i].startTime + differences[i].duration);
            // eslint-disable-next-line no-console
            console.log(`time: ${  JSON.stringify(time)}`);
        }

        // performance.clearMarks();
    };
}
export default new PerformanceChecker();
