interface AnalyticsEvent {
    name: string;
    properties: {
        [key: string]: string;
    };
}

const handleCachedEvents = () => {
    let eventQueue: AnalyticsEvent[] = [];
    const storedEvents = localStorage.getItem('pending_events');
    try {
        if (storedEvents) {
            eventQueue = JSON.parse(storedEvents) as AnalyticsEvent[];
            if (eventQueue.length > 0) {
                eventQueue.forEach(event => {
                    window.rudderanalytics.track(event.name, event.properties);
                });

                eventQueue = [];
                localStorage.removeItem('pending_events');
            }
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
};

const setEvent = (event: AnalyticsEvent): void => {
    const storedEvents = localStorage.getItem('pending_events');
    let eventQueue: AnalyticsEvent[] = [];
    if (storedEvents) {
        eventQueue = JSON.parse(storedEvents) as AnalyticsEvent[];
    }
    eventQueue.push(event);
    localStorage.setItem('pending_events', JSON.stringify(eventQueue));
};

const trackEventWithCache = (event: AnalyticsEvent): void => {
    if (window.rudderanalytics) {
        handleCachedEvents();
        window.rudderanalytics.track(event.name, event.properties);
    } else {
        setEvent(event);
    }
};

export { trackEventWithCache, handleCachedEvents };
