interface AnalyticsEvent {
    name: string;
    properties: {
        [key: string]: any;
    };
}

let eventQueue: AnalyticsEvent[] = [];

const setEvent = (event: AnalyticsEvent): void => {
    eventQueue.push(event);
    localStorage.setItem('pending_events', JSON.stringify(eventQueue));
};

const trackEvent = (event: AnalyticsEvent): void => {
    if (window.rudderanalytics) {
        window.rudderanalytics.track(event.name, event.properties);
    } else {
        setEvent(event);
    }
};

const loadPendingEvents = (): void => {
    const storedEvents = localStorage.getItem('pending_events');

    if (storedEvents) {
        eventQueue = JSON.parse(storedEvents) as AnalyticsEvent[];
    }
};

const initializeAnalytics = async (): Promise<void> => {
    try {
        if (eventQueue.length > 0) {
            eventQueue.forEach(event => {
                window.rudderanalytics.track(event.name, event.properties);
            });

            eventQueue = [];
            localStorage.removeItem('pending_events');
        }
    } catch (error) {
        console.log('Error initializing analytics:', error);
    }
};

// Initialize the module
loadPendingEvents();
initializeAnalytics();

export { trackEvent };
