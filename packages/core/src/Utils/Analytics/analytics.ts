import { Analytics } from '@deriv-com/analytics';

type ResponseData = {
    url: string;
    method: string;
    status: number;
    headers: string;
    data: string;
    payload: any;
};

type Event = {
    name: string;
    properties: Record<string, any>;
    cache?: boolean;
};

type Item = {
    element: Element | string;
    event: Event;
    cache?: boolean;
    callback?: (e: Event) => Event;
};

const cacheTrackEvents = {
    interval: null as NodeJS.Timeout | null,
    responses: [] as ResponseData[],
    isTrackingResponses: false,
    getCookies: (name: string): any => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const part = parts.pop();
            const cookieValue = part ? decodeURIComponent(part.split(';').shift()!) : null;

            try {
                return cookieValue ? JSON.parse(cookieValue) : null;
            } catch (e) {
                return cookieValue;
            }
        }
        return null;
    },
    trackPageUnload: () => {
        window.addEventListener('beforeunload', event => {
            if (!cacheTrackEvents.isPageViewSent()) {
                cacheTrackEvents.push('cached_analytics_page_views', {
                    name: window.location.href,
                    properties: {
                        url: window.location.href,
                    },
                });
            }
        });
    },

    isReady: (): boolean => {
        if (typeof Analytics === 'undefined' || Analytics === null) {
            return false;
        }

        const instances = (window as any).Analytics.Analytics.getInstances();
        return !!instances?.tracking;
    },
    parseCookies: (cookieName: string): any => {
        const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, cookie) => {
            const [key, value] = cookie.split('=');
            acc[decodeURIComponent(key)] = decodeURIComponent(value);
            return acc;
        }, {});

        return JSON.parse(cookies[cookieName] || 'null');
    },
    isPageViewSent: (): boolean =>
        !!cacheTrackEvents.responses.find(e => e.payload?.type === 'page' && e.payload?.anonymousId),
    set: (event: Event) => {
        cacheTrackEvents.push('cached_analytics_events', event);
    },
    push: (cookieName: string, data: any) => {
        let storedCookies: any[] = [];
        const cacheCookie = cacheTrackEvents.parseCookies(cookieName);
        if (cacheCookie) storedCookies = cacheCookie;
        storedCookies.push(data);

        document.cookie = `${cookieName}=${JSON.stringify(storedCookies)}; path=/; Domain=.deriv.com`;
    },
    processEvent: (event: Event): Event => {
        const clientInfo = cacheTrackEvents.getCookies('client_information');

        if (clientInfo) {
            const { email = null } = clientInfo;
        }

        return event;
    },
    track: (originalEvent: Event, cache: boolean) => {
        const event = cacheTrackEvents.processEvent(originalEvent);

        if (cacheTrackEvents.isReady() && !cache) {
            (window as any).Analytics.Analytics.trackEvent(event.name, event.properties);
        } else {
            cacheTrackEvents.set(event);
        }
    },
    pageView: () => {
        if (!cacheTrackEvents.isTrackingResponses) {
            cacheTrackEvents.trackPageUnload();
        }

        let pageViewInterval: NodeJS.Timeout | null = null;

        pageViewInterval = setInterval(() => {
            if (
                (window as any).Analytics !== 'undefined' &&
                (window as any).Analytics.Analytics?.pageView === 'function' &&
                cacheTrackEvents.isReady()
            ) {
                (window as any).Analytics.pageView(window.location.href);
            }

            if (cacheTrackEvents.isPageViewSent()) {
                clearInterval(pageViewInterval!);
            }
        }, 1000);
    },
    loadEvent: (items: Item[]) => {
        items.forEach(({ event }) => {
            const { name, properties } = event;
            cacheTrackEvents.track(
                {
                    name,
                    properties,
                },
                false
            );
        });

        return cacheTrackEvents;
    },
    pageLoadEvent: (
        items: Array<{ pages?: string[]; excludedPages?: string[]; event: Event; callback?: () => Event }>
    ) => {
        const pathname = window.location.pathname.slice(1);

        items.forEach(({ pages = [], excludedPages = [], event, callback = null }) => {
            let dispatch = false;
            if (pages.length) {
                if (pages.includes(pathname)) {
                    dispatch = true;
                }
            } else if (excludedPages.length) {
                if (!excludedPages.includes(pathname)) {
                    dispatch = true;
                }
            } else {
                dispatch = true;
            }

            if (dispatch) {
                const eventData = callback ? callback() : event;
                cacheTrackEvents.loadEvent([
                    {
                        event: eventData,
                        element: '',
                    },
                ]);
            }
        });

        return cacheTrackEvents;
    },
};

export default cacheTrackEvents;
