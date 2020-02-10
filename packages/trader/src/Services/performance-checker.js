import { isFirefox, isSafari, isEdge } from '_common/browser_detect';

const performance_metrics = {
    start: 'started',
    firstContentfulPaint: 'first-contentful-paint',
    smartChartMounted: 'smart-charts-mounted',
    purchaseStart: 'purchase-started',
    purchaseEnd: 'purchase-ended',
    purchaseEnabled: 'purchase-enabled',
    tradeEngineStart: 'trade-engine-started',
    tradeEngineReady: 'trade-engine-enabled',
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
                performance_metrics.firstContentfulPaint,
                performance_metrics.start,
                performance_metrics.firstContentfulPaint
            );
        }

        // start --- smartChartMounted
        performance.measure(
            performance_metrics.smartChartMounted,
            performance_metrics.start,
            performance_metrics.smartChartMounted
        );
        // start --- purchaseEnabled
        performance.measure(
            performance_metrics.purchaseEnabled,
            performance_metrics.start,
            performance_metrics.purchaseEnabled
        );
        // tradeEngineStart --- tradeEngineReady
        performance.measure(
            performance_metrics.tradeEngineReady,
            performance_metrics.tradeEngineStart,
            performance_metrics.tradeEngineReady
        );

        if (
            performance.getEntriesByName(performance_metrics.purchaseStart, 'mark').length > 0 &&
            performance.getEntriesByName(performance_metrics.purchaseEnd, 'mark').length > 0
        ) {
            performance.measure(
                performance_metrics.purchaseEnd,
                performance_metrics.purchaseStart,
                performance_metrics.purchaseEnd
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
