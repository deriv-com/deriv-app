import { Analytics } from '@deriv-com/analytics';
import Cookies from 'js-cookie';

interface Payload {
    type: string;
    anonymousId: string;
}

type ResponseData = {
    url: string;
    method: string;
    status: number;
    headers: string;
    data: string;
    payload: Payload;
};
type Event = {
    name: string;
    properties: Record<string, string>;
    cache?: boolean;
};
type Item = {
    event: Event;
    cache?: boolean;
    callback?: (e: Event) => Event;
};
const cacheTrackEvents = {
    interval: null as NodeJS.Timeout | null,
    responses: [] as ResponseData[],
    isTrackingResponses: false,
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
        // eslint-disable-next-line no-console
        console.log('Analytics', Analytics);
        if (typeof Analytics === 'undefined' || Analytics === null) {
            return false;
        }
        const instances = Analytics?.getInstances();
        return !!instances?.tracking;
        // eslint-disable-next-line no-console
        console.log('instances tracking', instances);
    },
    parseCookies: (cookieName: string): any => {
        // eslint-disable-next-line no-console
        console.log('cookieName', cookieName);
        const cookies: { [key: string]: string } = document.cookie
            .split('; ')
            .reduce((acc: { [key: string]: string }, cookie: string) => {
                const [key, value] = cookie.split('=');
                acc[decodeURIComponent(key)] = decodeURIComponent(value);
                return acc;
            }, {});
        // eslint-disable-next-line no-console
        console.log('cookies', cookies);
        try {
            // eslint-disable-next-line no-console
            console.log('reaches in the parse try');
            // eslint-disable-next-line no-console
            console.log('cookies[cookieName]', cookies[cookieName]);
            // eslint-disable-next-line no-console
            console.log('parse cookies', JSON.parse(cookies[cookieName]));
            return cookies[cookieName] ? JSON.parse(cookies[cookieName]) : null;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('return null');
            return null;
        }
    },
    isPageViewSent: (): boolean =>
        !!cacheTrackEvents.responses.find(e => e.payload?.type === 'page' && e.payload?.anonymousId),
    set: (event: Event) => {
        cacheTrackEvents.push('cached_analytics_events', event);
        // eslint-disable-next-line no-console
        console.log('event pushed to cache');
    },
    push: (cookieName: string, data: Event) => {
        let storedCookies: Event[] = [];
        const cacheCookie = cacheTrackEvents.parseCookies(cookieName);
        if (cacheCookie) storedCookies = cacheCookie;
        // eslint-disable-next-line no-console
        console.log('cacheCookie', cacheCookie);
        // eslint-disable-next-line no-console
        console.log('storedCookies', storedCookies);
        storedCookies.push(data);
        let domain = '';
        if (window.location.hostname.includes('deriv.com')) {
            domain = '.deriv.com';
        } else if (window.location.hostname.includes('binary.sx')) {
            domain = '.binary.sx';
        } else if (window.location.hostname.includes('localhost')) {
            // eslint-disable-next-line no-console
            console.log('reaches localhost');
            domain = 'localhost:8443';
        }
        document.cookie = `${cookieName}=${JSON.stringify(storedCookies)}; path=/; Domain=${domain}`;
        // eslint-disable-next-line no-console
        console.log('cookie set', document.cookie);
    },
    processEvent: (event: Event): Event => {
        const clientInfo = Cookies.get('client_information');
        if (clientInfo) {
            const { email = null } = JSON.parse(clientInfo);
            if (email) {
                event.properties.email = email;
            }
        }
        if (event?.properties?.email) {
            const email = event.properties.email;
            delete event.properties.email;
        }
        return event;
    },
    track: (originalEvent: Event, cache: boolean) => {
        const event: any = cacheTrackEvents.processEvent(originalEvent);
        if (!cacheTrackEvents.isReady() && !cache) {
            // eslint-disable-next-line no-console
            console.log('tracking with cache');
            Analytics?.trackEvent(event.name, event.properties);
        } else {
            // eslint-disable-next-line no-console
            console.log('create caching mech');
            cacheTrackEvents.set(event);
        }
    },
    pageView: () => {
        if (!cacheTrackEvents.isTrackingResponses) {
            cacheTrackEvents.trackPageUnload();
        }
        let pageViewInterval: NodeJS.Timeout | null = null;
        pageViewInterval = setInterval(() => {
            if (Analytics !== undefined && typeof Analytics?.pageView === 'function' && cacheTrackEvents.isReady()) {
                Analytics?.pageView(window.location.href);
            }
            if (cacheTrackEvents.isPageViewSent()) {
                clearInterval(pageViewInterval!);
            }
        }, 1000);
    },
    loadEvent: (items: Item[]) => {
        items.forEach(({ event, cache }) => {
            // eslint-disable-next-line no-console
            console.log('items', items);
            const { name, properties } = event;
            // eslint-disable-next-line no-console
            console.log('event: ', event);
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
        if (!Array.isArray(items)) {
            return cacheTrackEvents;
        }
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
                    },
                ]);
            }
        });
        return cacheTrackEvents;
    },
};
export default cacheTrackEvents;
