// import React from 'react';
import PropTypes                   from 'prop-types';
import { connect }                 from 'Stores/connect';

const Performance = ({
    gtmStore,
}) => {    // GTM-NF7884S
    // GTM-M596458 dummy
    // eslint-disable-next-line no-console
    console.log('PerformanceObserver 1');
    const observer = new PerformanceObserver(function(list) {
        // eslint-disable-next-line no-console
        console.log('PerformanceObserver 2');
        const perfEntries = list.getEntries();
        for (let i = 0; i < perfEntries.length; i++) {
            const time = Math.round(perfEntries[i].startTime + perfEntries[i].duration);
            // dataLayer.push({
            //     'event' : perfEntries[i].name,
            //     duration: time,
            // });
            // eslint-disable-next-line no-console
            console.log('MEASURING');
            gtmStore.pushLoadPerformance(perfEntries[i].name, time);
        }
    });
    // register observer for paint timing notifications
    observer.observe({ entryTypes: ['paint'] });
    return null;
};

Performance.propTypes = {
    gtmStore: PropTypes.object,
};

export default connect(
    ({ gtm }) => ({
        gtmStore: gtm,
    }),
)(Performance);
