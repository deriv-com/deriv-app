interface AnalyticsEvent {
    name: string;
    properties: {
        [key: string]: string;
    };
}

let eventQueue: AnalyticsEvent[] = [];

const setEvent = (event: AnalyticsEvent): void => {
    eventQueue.push(event);
    localStorage.setItem('pending_events', JSON.stringify(eventQueue));
};

const trackEventWithCache = (event: AnalyticsEvent): void => {
    if (window.rudderanalytics) {
        window.rudderanalytics.track(event.name, event.properties);
    } else {
        setEvent(event);
        handleCachedEvents();
    }
};
const handleCachedEvents = () => {
    const loadPendingEvents = () => {
        const storedEvents = localStorage.getItem('pending_events');

        if (storedEvents) {
            eventQueue = JSON.parse(storedEvents) as AnalyticsEvent[];
        }
    };
    try {
        loadPendingEvents();
        if (eventQueue.length > 0) {
            eventQueue.forEach(event => {
                window.rudderanalytics.track(event.name, event.properties);
            });

            eventQueue = [];
            localStorage.removeItem('pending_events');
        }
    } catch (error) {
        console.log(error);
    }
};

export { trackEventWithCache, handleCachedEvents };
