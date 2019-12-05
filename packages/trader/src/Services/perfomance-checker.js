import {
    isFirefox,
    isSafari,
    isEdge,
} from '_common/browser_detect';

const performanceMetrics = {
    start               : 'started',
    firstContentfulPaint: 'first-contentful-paint',
    smartChartMounted   : 'smart-charts-mounted',
    purchaseStart       : 'purchase-started',
    purchaseEnd         : 'purchase-ended',
    purchaseEnabled     : 'purchase-enabled',
    tradeEngineStart    : 'trade-engine-started',
    tradeEngineReady    : 'trade-engine-enabled',
};

let is_data_sent = false;

function measurePerformance(pushLoadPerformance) {
    try {
        if (is_data_sent) {
            return;
        }
        
        if (isFirefox() || isSafari() || isEdge()) {
            // start --- firstContentfulPaint
            performance.measure(
                performanceMetrics.firstContentfulPaint,
                performanceMetrics.start,
                performanceMetrics.firstContentfulPaint
            );
        }

        // start --- smartChartMounted
        performance.measure(
            performanceMetrics.smartChartMounted,
            performanceMetrics.start,
            performanceMetrics.smartChartMounted
        );
        // start --- purchaseEnabled
        performance.measure(
            performanceMetrics.purchaseEnabled,
            performanceMetrics.start,
            performanceMetrics.purchaseEnabled
        );
        // tradeEngineStart --- tradeEngineReady
        performance.measure(
            performanceMetrics.tradeEngineReady,
            performanceMetrics.tradeEngineStart,
            performanceMetrics.tradeEngineReady
        );

        if (
            performance.getEntriesByName(performanceMetrics.purchaseStart, 'mark')
                .length > 0 &&
      performance.getEntriesByName(performanceMetrics.purchaseEnd, 'mark')
          .length > 0
        ) {
            performance.measure(
                performanceMetrics.purchaseEnd,
                performanceMetrics.purchaseStart,
                performanceMetrics.purchaseEnd
            );
        }

        const differences = performance.getEntriesByType('measure');

        for (let i = 0; i < differences.length; i++) {
            pushLoadPerformance(differences[i].name, differences[i].duration);
        }
        is_data_sent = true;
    } catch (error) {
    // eslint-disable-next-line no-console
        console.warn(error);
    }
}
export { measurePerformance };
