const performanceMetrics = {
    start           : 'start',
    smartChartLoaded: 'smart-chart-loaded',
    purchaseStart   : 'purchase-start',
    purchaseEnd     : 'purchase-end',
    purchaseEnabled : 'purchase-enabled',
    tradeEngineStart: 'trade-engine-start',
    tradeEngineReady: 'trade-engine-ready',
};

function measurePerformance () {
    try {
        // start --- smartChartLoaded
        performance.measure(
            performanceMetrics.smartChartLoaded,
            performanceMetrics.start,
            performanceMetrics.smartChartLoaded);
        // start --- purchaseEnabled
        performance.measure(
            performanceMetrics.purchaseEnabled,
            performanceMetrics.start,
            performanceMetrics.purchaseEnabled);
        // tradeEngineStart --- tradeEngineReady
        performance.measure(
            performanceMetrics.tradeEngineReady,
            performanceMetrics.tradeEngineStart,
            performanceMetrics.tradeEngineReady);

        if (performance.getEntriesByName(performanceMetrics.purchaseStart, 'mark').length > 0 &&
        performance.getEntriesByName(performanceMetrics.purchaseEnd, 'mark').length > 0) {
            performance.measure(
                performanceMetrics.purchaseEnd,
                performanceMetrics.purchaseStart,
                performanceMetrics.purchaseEnd);
        }

        const differences = performance.getEntriesByType('measure');
        
        for (let i = 0; i < differences.length; i++) {
            dataLayer.push({
                'event' : differences[i].name,
                duration: differences[i].duration,
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
    }
}
export {
    measurePerformance,
};
